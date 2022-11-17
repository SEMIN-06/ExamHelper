import { useEffect, useRef, useState } from 'react';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { ThreeDots } from 'react-loader-spinner';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fireStore } from 'renderer/components/Firebase';
import { doc, DocumentData, getDoc } from 'firebase/firestore';

const Project = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();

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
        projectId.current = params.projectId;
        const docSnap = await getDoc(doc(fireStore, "projects", projectId.current as string));
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

  <ThreeDots
    height="60"
    width="60"
    radius="9"
    color="#ffffff"
    ariaLabel="Loading..."
    wrapperStyle={{
      position: "absolute",
      transform: "translate(-50%, -50%)",
      left: "50%",
      top: "50%"
    }}
    visible={!loaded}
  />

  return (
    <>
      {(loaded && projectDBData) &&
        <>
          <h2>{projectDBData.title}</h2>
          <h2>{projectId.current}</h2>
          <Link to={`/project/${projectId.current}/edit`}><button>수정</button></Link>
        </>

      }
    </>
  );
};

export default Project;
