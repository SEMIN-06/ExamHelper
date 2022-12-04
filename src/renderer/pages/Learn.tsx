import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fireStore } from '../Firebase';
import { doc, DocumentData, getDoc, deleteDoc } from 'firebase/firestore';
import styled, { css } from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import LoadingSpinner from '../components/LoadingSpinner';
import useModal from '../hooks/useModal';

const NumberCircles = [ "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮" ]

const PrintWrapper = styled.div<{zoomLevel: number}>`
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;

  zoom: ${props => props.zoomLevel}%;
`;

const Page = styled.div`
  width: 21cm;
  min-height: 29.7cm;
  background-color: white;
  margin-bottom: 0.5cm;
  overflow: hidden;

  box-sizing: border-box;
  -moz-box-sizing: border-box;

  white-space: pre-wrap;

  padding: 0.5cm;

  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Text = styled.div`
  font-family: "SeoulNamsanC" !important;
  font-weight: 700;
  font-size: 16px;
  transform: rotate(-0.03deg);

  .subject {
    font-family: "SeoulNamsanC";
    font-weight: 900 !important;

    span {
      font-weight: 900 !important;
    }
  }

  p, span {
    font-family: "SeoulNamsanC";
    font-weight: 700;

    span {
      border-radius: 5px;
    }
  }

  .editable {
    display: inline-block;
    white-space: nowrap;
  }

  .editable:before {
    content: attr(data-hover);
    visibility: hidden;
    opacity: 0;
    background-color: rgba(0, 0, 0, 50);
    color: white;
    z-index: 1;
    position: absolute;
    border-radius: 3px;
  }

  .editable:hover:before {
    opacity: 1;
    visibility: visible;
  }
`;

const Buttons = styled.div`
  position: absolute;
  top: 10%;
`;

const Print = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const printRef = useRef<HTMLDivElement>(null);
  const [ zoomLevel, setZoomLevel ] = useState<number>(100);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const goBackProblem = (errorCode: string) => {
    navigate(-1);
    toast(`프로젝트 로딩 중 문제가 발생했어요. (${errorCode})`, {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark"
    });
  };

  useEffect(() => {
    const fn = async () => {
      if (params.projectId != undefined) {
        projectId.current = params.projectId as string;
        const docSnap = await getDoc(doc(fireStore, "projects", projectId.current));
        if (docSnap.exists()) {
          setProjectDBData(docSnap.data());
          setLoaded(true);
        } else {
          goBackProblem("PROJECT-NULL");
        }
      } else {
        goBackProblem("PROJECTID-UNDEFINED");
      }
    }
    fn();
  }, []);

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      context.font = font;

      return context.measureText(text).width;
    }
  }

  const highlightMadeFunc = (content: string) => {
    const element = document.createElement("div");
    element.innerHTML = content;

    const highlightElements = element.querySelectorAll(".editable");
    highlightElements.forEach((value) => {
      (value as any).style.width = `${getTextWidth(value.textContent as string, "16px SeoulNamsanC")}px`;
      value.setAttribute("data-text", value.textContent as string);
      value.textContent = "";

      let _outerHTML = value.outerHTML;
      _outerHTML = _outerHTML.replaceAll(/(<[bui])/g, "<span");
      _outerHTML = _outerHTML.replaceAll(/(<[/][bui]>)/g, "</span>");
      value.outerHTML = _outerHTML;
    })
    return element;
  };

  const questionsData = projectDBData && Object.values(projectDBData.questions).map((value: any, index: number) => {
    const highlightReplaces = {
      from: `style="background-color: rgb(247, 224, 72);"`,
      to: `class="editable" contenteditable spellCheck="false"`
    };

    value.content = value.content.replace(/<div>/gi, "<br>").replace(/<\/div>/gi, "");
    value.content = value.content.replaceAll("<br>-&gt;", "\n    -&gt;"); // -&gt; = >

    value.subject = value.subject.replaceAll(highlightReplaces.from, highlightReplaces.to);
    value.meaning = value.meaning.replaceAll(highlightReplaces.from, highlightReplaces.to);
    value.content = value.content.replaceAll(highlightReplaces.from, highlightReplaces.to);

    const contents = value.content.split("<br>");

    let filterdContent: string = "";
    (contents.length > 0 && contents[0] != "") && contents.map((value: any, index: number) => {
      filterdContent += `-> ${NumberCircles[index]} ${value}<br>`;
    });

    const filterdSubjectElement = highlightMadeFunc(value.subject);
    const filterdContentElement = highlightMadeFunc(filterdContent);
    const filterdMeaningElement = highlightMadeFunc(value.meaning);

    return (
      <Text key={value.id}>
        <span className="subject" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${filterdSubjectElement.innerHTML}` }} /> - <span dangerouslySetInnerHTML={{ __html: filterdMeaningElement.innerHTML }} /><br></br><p dangerouslySetInnerHTML={{ __html: filterdContentElement.innerHTML }}/>
        {value.attachImage && <img src={value.attachImage} style={{ maxWidth: "30%", maxHeight: "30%" }} />}
      </Text>
    );
  });

  const checkCorrect = () => {
    const highlightElements = document.querySelectorAll(".editable");
    let corrects = 0;
    highlightElements.forEach((value) => {
      const ogText = value.getAttribute("data-text");
      const writtenText = value.textContent;
      if (ogText != writtenText) {
        (value as any).style.color = "red";
        value.setAttribute("data-hover", ogText as string);
      } else {
        corrects++;
      }
    })

    toast(`${corrects} / ${highlightElements.length}`, {
      position: "bottom-center",
      autoClose: 30000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark"
    });

  };

  return (
    <>
      <LoadingSpinner visible={!loaded}/>

      {(loaded && projectDBData) &&
        <PrintWrapper zoomLevel={zoomLevel}>
          <Page ref={printRef}>
            {questionsData}
          </Page>
        </PrintWrapper>
      }

      <Buttons>
        <button onClick={() => navigate(-1)}>이전</button>
        <br></br>
        <button onClick={handlePrint}>인쇄</button>
        <br></br>
        <button onClick={checkCorrect}>정답 체크</button>
        <br></br>
        <button onClick={() => setZoomLevel(zoomLevel + 10)}>확대</button>
        <br></br>
        <button onClick={() => setZoomLevel(zoomLevel - 10)}>축소</button>
      </Buttons>
    </>
  );
};

export default Print;