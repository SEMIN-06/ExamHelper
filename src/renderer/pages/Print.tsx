import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import { useRecoilState } from 'recoil';
import { fireStore } from '../Firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PrintWrapper,
  Page,
  Controls,
  PageTitle,
  Text,
} from '../styles/CommonStyles';
import { darkModeState } from '../recoil/DarkModeRecoil';

const Print = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const printRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
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

  const parseContent = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const highlights = Array.from(
      doc.querySelectorAll('[style*="background-color: rgb(247, 224, 72)"]')
    );

    let result = content;
    highlights.forEach((highlight) => {
      const text = highlight.textContent || '';
      result = result.replace(
        highlight.outerHTML,
        `<span class="highlight">${text}</span>`
      );
    });

    return result;
  };

  useEffect(() => {
    const fn = async () => {
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
    };
    fn();
  }, []);

  const questionsData =
    projectDBData &&
    Object.values(projectDBData.questions).map((value: any, index: number) => {
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
              : `<div class="line"><span class="line-number">${j++}</span>${line}</div>`;
          })
          .join('');
      }

      parsedContent = parseContent(parsedContent);
      return (
        <Text key={value.id} isDarkMode={isDarkMode}>
          <div
            className="subject"
            dangerouslySetInnerHTML={{
              __html: `${index + 1}. ${parsedSubject}`,
            }}
          />
          {(value.meaning || value.content) && (
            <>
              {value.meaning && (
                <div
                  className="meaning"
                  dangerouslySetInnerHTML={{ __html: parsedMeaning }}
                />
              )}
              {value.content && (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
              )}
            </>
          )}
          {value.attachImage && (
            <img src={value.attachImage} alt={`Question ${index + 1} image`} />
          )}
        </Text>
      );
    });

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

export default Print;
