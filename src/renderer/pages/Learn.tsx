import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import DOMPurify from 'dompurify';
import { useRecoilState } from 'recoil';
import { useHotkeys } from 'react-hotkeys-hook';
import { fireStore } from '../Firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PrintWrapper,
  Page,
  Controls,
  PageTitle,
} from '../styles/CommonStyles';
import { EditableText } from '../styles/LearnStyles';
import { IQuestion } from '../types';
import { darkModeState } from '../recoil/DarkModeRecoil';

const Learn = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const printRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDarkMode, setDarkMode] = useRecoilState(darkModeState);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5cm;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    `,
  });

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    return 0;
  };

  const parseContent = (content: string) => {
    const parser = new DOMParser();
    const document = parser.parseFromString(content, 'text/html');
    const highlights = Array.from(
      document.querySelectorAll(
        '[style*="background-color: rgb(247, 224, 72)"]'
      )
    );

    let result = content;
    highlights.forEach((highlight) => {
      const text = highlight.textContent || '';
      const width = getTextWidth(text, '16px -apple-system');
      result = result.replace(
        highlight.outerHTML,
        `<span class="editable" contenteditable spellCheck="false" data-text="${text}" style="width: ${width}px" onkeydown="if (event.keyCode == 112) { const ogText = this.getAttribute('data-text'); this.setAttribute('data-ctrl', ogText) }" onmousedown="this.setAttribute('data-ctrl', '')" onkeyup="this.setAttribute('data-ctrl', '')"></span>`
      );
    });

    return result;
  };

  const checkCorrect = () => {
    const highlightElements = document.querySelectorAll('.editable');
    let corrects = 0;
    highlightElements.forEach((value) => {
      const ogText = value.getAttribute('data-text');
      const writtenText = value.textContent;
      if (ogText?.replaceAll(' ', '') !== writtenText?.replaceAll(' ', '')) {
        value.setAttribute('data-hover', ogText as string);
        (value as HTMLElement).style.color = '#f21f4a';
        if (!writtenText) {
          (value as HTMLElement).style.background = '#f21f4a';
          (value as HTMLElement).style.borderRadius = '3px';
        }
      } else {
        corrects += 1;
      }
    });

    toast(`정답: ${corrects} / ${highlightElements.length}`, {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: isDarkMode ? 'dark' : 'light',
    });
  };

  const restore = () => {
    const highlightElements = document.querySelectorAll('.editable');
    highlightElements.forEach((value) => {
      value.removeAttribute('data-hover');
      (value as HTMLElement).style.color = '';
      (value as HTMLElement).style.background = '';
      (value as HTMLElement).style.borderRadius = '';
      value.textContent = '';
    });
  };

  const fetchProject = useRef(async () => {
    if (params.projectId) {
      projectId.current = params.projectId;
      const docSnap = await getDoc(
        doc(fireStore, 'projects', projectId.current)
      );
      if (docSnap.exists()) {
        setProjectDBData(docSnap.data());
        setLoaded(true);
      } else {
        navigate(-1);
        toast('프로젝트를 찾을 수 없습니다.', {
          position: 'bottom-center',
          theme: isDarkMode ? 'dark' : 'light',
        });
      }
    }
  });

  useEffect(() => {
    fetchProject.current();
  }, []);

  const questionsData =
    projectDBData &&
    Object.values(projectDBData.questions as Record<string, IQuestion>).map(
      (value: IQuestion, index: number) => {
        value.content = value.content
          .replace(/<div>/gi, '<br>')
          .replace(/<\/div>/gi, '');

        const parsedSubject = parseContent(value.subject);
        const parsedMeaning = parseContent(value.meaning);

        let parsedContent = value.content;
        if (value.content) {
          const lines = parsedContent.split('<br>');
          let j = 1;
          parsedContent = lines
            .map((line) => {
              if (!line.trim()) return '';

              const isIndented = line.trim().startsWith('-&gt;');
              const indentedLine = `<div class="line"><span style="padding-left: 1rem">${line}</span></div>`;

              return isIndented
                ? indentedLine
                : `<div class="line"><span class="line-number">${j}</span>${line}</div>`;
            })
            .join('');
          j += 1;
        }

        parsedContent = parseContent(parsedContent);
        return (
          <EditableText key={value.id} isDarkMode={isDarkMode}>
            <div
              className="subject"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(`${index + 1}. ${parsedSubject}`),
              }}
            />
            {(value.meaning || value.content) && (
              <>
                {value.meaning && (
                  <div
                    className="meaning"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: parsedMeaning }}
                  />
                )}
                {value.content && (
                  <div
                    className="content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />
                )}
              </>
            )}
            {value.attachImage && (
              <img src={value.attachImage} alt={`Question ${index + 1}`} />
            )}
          </EditableText>
        );
      }
    );

  return (
    <>
      <LoadingSpinner visible={!loaded} />
      {loaded && projectDBData && (
        <PrintWrapper zoomLevel={zoomLevel} isDarkMode={isDarkMode}>
          <Page ref={printRef} isDarkMode={isDarkMode}>
            <PageTitle isDarkMode={isDarkMode}>{projectDBData.title}</PageTitle>
            {questionsData}
          </Page>
        </PrintWrapper>
      )}

      <Controls isDarkMode={isDarkMode}>
        <button type="button" onClick={() => navigate(-1)}>
          <span>← 이전으로</span>
        </button>
        <button type="button" onClick={handlePrint} className="primary">
          <span>🖨 인쇄하기</span>
        </button>
        <button type="button" onClick={checkCorrect}>
          <span>✓ 정답 확인</span>
        </button>
        <button type="button" onClick={restore}>
          <span>↺ 초기화</span>
        </button>
        <button type="button" onClick={() => setZoomLevel(zoomLevel + 10)}>
          <span>🔍 확대</span>
        </button>
        <button type="button" onClick={() => setZoomLevel(zoomLevel - 10)}>
          <span>🔍 축소</span>
        </button>
        <button type="button" onClick={() => setDarkMode(!isDarkMode)}>
          <span>{isDarkMode ? '☀️ 라이트' : '🌙 다크'}</span>
        </button>
      </Controls>
    </>
  );
};

export default Learn;
