import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, DocumentData, getDoc, deleteDoc } from 'firebase/firestore';
import styled, { css } from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { fireStore } from '../Firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import useModal from '../hooks/useModal';

const NumberCircles = [
  '①',
  '②',
  '③',
  '④',
  '⑤',
  '⑥',
  '⑦',
  '⑧',
  '⑨',
  '⑩',
  '⑪',
  '⑫',
  '⑬',
  '⑭',
  '⑮',
  '⑯',
  '⑰',
  '⑱',
  '⑲',
  '⑳',
  '㉑',
  '㉒',
  '㉓',
  '㉔',
  '㉕',
  '㉖',
  '㉗',
  '㉘',
  '㉙',
  '㉚',
  '㉛',
  '㉜',
  '㉝',
  '㉞',
  '㉟',
  '㊱',
  '㊲',
  '㊳',
  '㊴',
  '㊵',
  '㊶',
  '㊷',
  '㊸',
  '㊹',
  '㊺',
  '㊻',
  '㊼',
  '㊽',
  '㊾',
  '㊿',
];

const PrintWrapper = styled.div<{ zoomLevel: number }>`
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;

  zoom: ${(props) => props.zoomLevel}%;
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
  font-family: 'SeoulNamsanC' !important;
  font-weight: 700;
  font-size: 16px;
  transform: rotate(-0.03deg);

  .subject {
    font-family: 'SeoulNamsanC';
    font-weight: 900 !important;

    span {
      font-weight: 900 !important;
    }
  }

  p,
  span {
    font-family: 'SeoulNamsanC';
    font-weight: 700;

    span {
      border-radius: 3px;
    }
  }

  u {
    text-decoration: none !important;
  }

  .editable {
    display: inline-block;
    white-space: nowrap;
    border-radius: 3px;
  }

  .editable:before {
    visibility: hidden;
    opacity: 0;
    background-color: rgba(0, 0, 0, 50);
    color: white;
    z-index: 1;
    position: absolute;
    border-radius: 3px;
  }

  .editable:hover:before {
    content: attr(data-hover);
    opacity: 1;
    visibility: visible;
  }

  .editable:focus:before {
    content: attr(data-ctrl);
    opacity: 1;
    visibility: visible;
  }

  .editable:focus {
    outline: 1.5px solid #242424;
  }
`;

const Buttons = styled.div`
  position: absolute;
  top: 10%;
`;

const Print = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const printRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const goBackProblem = (errorCode: string) => {
    navigate(-1);
    toast(`프로젝트 로딩 중 문제가 발생했어요. (${errorCode})`, {
      position: 'bottom-left',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  useEffect(() => {
    const fn = async () => {
      if (params.projectId != undefined) {
        projectId.current = params.projectId as string;
        const docSnap = await getDoc(
          doc(fireStore, 'projects', projectId.current)
        );
        if (docSnap.exists()) {
          setProjectDBData(docSnap.data());
          setLoaded(true);
        } else {
          goBackProblem('PROJECT-NULL');
        }
      } else {
        goBackProblem('PROJECTID-UNDEFINED');
      }
    };
    fn();
  }, []);

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      context.font = font;

      return context.measureText(text).width;
    }
  };

  const highlightMadeFunc = (content: string) => {
    const element = document.createElement('div');
    element.innerHTML = content;

    const highlightElements = element.querySelectorAll('.editable');
    highlightElements.forEach((value) => {
      (value as any).style.width = `${getTextWidth(
        value.textContent as string,
        '16px SeoulNamsanC'
      )}px`;
      value.setAttribute('data-text', value.textContent as string);
      value.textContent = '';

      let _outerHTML = value.outerHTML;
      _outerHTML = _outerHTML.replaceAll(/(<[bui])/g, '<span');
      _outerHTML = _outerHTML.replaceAll(/(<[/][bui]>)/g, '</span>');
      value.outerHTML = _outerHTML;
    });
    return element;
  };

  // TODO: React에 맞지 않는 코드 (DOM에 직접 접근)로 리메이크 필요함
  const questionsData =
    projectDBData &&
    Object.values(projectDBData.questions).map((value: any, index: number) => {
      const highlightReplaces = {
        from: `style="background-color: rgb(247, 224, 72);"`,
        to: `class="editable" contenteditable spellCheck="false" onkeydown="if (event.keyCode == 112) { const ogText = this.getAttribute('data-text'); this.setAttribute('data-ctrl', ogText) }" onmousedown="this.setAttribute('data-ctrl', '')" onkeyup="this.setAttribute('data-ctrl', '')"`,
      };

      value.content = value.content
        .replace(/<div>/gi, '<br>')
        .replace(/<\/div>/gi, '');
      value.content = value.content.replaceAll('<br>-&gt;', '\n    -&gt;'); // -&gt; = >

      value.subject = value.subject.replaceAll(
        highlightReplaces.from,
        highlightReplaces.to
      );
      value.meaning = value.meaning.replaceAll(
        highlightReplaces.from,
        highlightReplaces.to
      );
      value.content = value.content.replaceAll(
        highlightReplaces.from,
        highlightReplaces.to
      );

      const contents = value.content.split('<br>');

      let filterdContent = '';
      contents.length > 0 &&
        contents[0] != '' &&
        contents.map((value: any, index: number) => {
          filterdContent += `-> ${value}<br>`;
        });

      const filterdSubjectElement = highlightMadeFunc(value.subject);
      const filterdContentElement = highlightMadeFunc(filterdContent);
      const filterdMeaningElement = highlightMadeFunc(value.meaning);

      return (
        <Text key={value.id}>
          {value.meaning == '' && value.content == '' ? (
            <>
              <span className="subject">{index + 1}.</span>{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: filterdSubjectElement.innerHTML,
                }}
              />
            </>
          ) : (
            <>
              <span
                className="subject"
                dangerouslySetInnerHTML={{
                  __html: `${index + 1}. ${filterdSubjectElement.innerHTML}`,
                }}
              />{' '}
              -{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: filterdMeaningElement.innerHTML,
                }}
              />
              <br />
              <p
                dangerouslySetInnerHTML={{
                  __html: filterdContentElement.innerHTML,
                }}
              />
            </>
          )}
          {value.attachImage && (
            <img
              src={value.attachImage}
              style={{ maxWidth: '30%', maxHeight: '30%' }}
            />
          )}
        </Text>
      );
    });

  const checkCorrect = () => {
    const highlightElements = document.querySelectorAll('.editable');
    let corrects = 0;
    highlightElements.forEach((value) => {
      const ogText = value.getAttribute('data-text');
      const writtenText = value.textContent;
      if (ogText?.replaceAll(' ', '') != writtenText?.replaceAll(' ', '')) {
        value.setAttribute('data-hover', ogText as string);
        (value as any).style.color = '#f21f4a';
        if (writtenText == '' || writtenText == null) {
          (value as any).style.background = '#f21f4a';
          (value as any).style.borderRadius = '5px';
        }
      } else {
        corrects++;
      }
    });

    toast(`${corrects} / ${highlightElements.length}`, {
      position: 'bottom-center',
      autoClose: 30000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const restore = () => {
    const highlightElements = document.querySelectorAll('.editable');
    highlightElements.forEach((value) => {
      value.removeAttribute('data-hover');
      (value as any).style.color = '';
      (value as any).style.background = '';
      (value as any).style.borderRadius = '';
    });
  };

  return (
    <>
      <LoadingSpinner visible={!loaded} />

      {loaded && projectDBData && (
        <PrintWrapper zoomLevel={zoomLevel}>
          <Page ref={printRef}>{questionsData}</Page>
        </PrintWrapper>
      )}

      <Buttons>
        <button onClick={() => navigate(-1)}>이전</button>
        <br />
        <button onClick={handlePrint}>인쇄</button>
        <br />
        <button onClick={checkCorrect}>정답 체크</button>
        <br />
        <button onClick={restore}>원 상태로</button>
        <br />
        <button onClick={() => setZoomLevel(zoomLevel + 10)}>확대</button>
        <br />
        <button onClick={() => setZoomLevel(zoomLevel - 10)}>축소</button>
      </Buttons>
    </>
  );
};

export default Print;
