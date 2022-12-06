import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fireStore } from '../Firebase';
import { doc, DocumentData, getDoc, deleteDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import LoadingSpinner from '../components/LoadingSpinner';

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

  @page {
    size: A4;
    margin: 0.3cm;
  }

  @media print {
    @page {
      margin: 0.3cm;
    }
    margin: 0.3cm;
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
      border-radius: 3px;
    }
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

  const questionsData = projectDBData && Object.values(projectDBData.questions).map((value: any, index: number) => {
    value.content = value.content.replace(/<div>/gi, "<br>").replace(/<\/div>/gi, "");
    value.content = value.content.replaceAll("<br>-&gt;", "\n    -&gt;"); // -&gt; = >
    const contents = value.content.split("<br>");

    let filterdContent: string = "";
    (contents.length > 0 && contents[0] != "") && contents.map((value: any, index: number) => {
      filterdContent += `-> ${NumberCircles[index]} ${value}<br>`;
    });

    return (
      <Text key={value.id}>
        <span className="subject" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${value.subject}` }} /> - <span dangerouslySetInnerHTML={{ __html: value.meaning }} /><br></br><p dangerouslySetInnerHTML={{ __html: filterdContent }}/>
        {value.attachImage && <img src={value.attachImage} style={{ maxWidth: "30%", maxHeight: "30%" }} />}
      </Text>
    );
  })

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
        <button onClick={() => setZoomLevel(zoomLevel + 10)}>확대</button>
        <br></br>
        <button onClick={() => setZoomLevel(zoomLevel - 10)}>축소</button>
      </Buttons>
    </>
  );
};

export default Print;
