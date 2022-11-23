import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fireStore } from '../Firebase';
import { doc, DocumentData, getDoc, deleteDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import LoadingSpinner from '../components/LoadingSpinner';

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

const Print = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const printRef = useRef<HTMLElement>(null);
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

  const questionsData = projectDBData && Object.values(projectDBData.questions).map((value: any) => {
    return (
      <h4><strong>{value.subject}</strong> - {value.content}</h4>
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

      <button onClick={handlePrint}>인쇄</button>
    </>
  );
};

export default Print;
