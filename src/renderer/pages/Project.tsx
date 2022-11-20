import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fireStore } from '../Firebase';
import { doc, DocumentData, getDoc, deleteDoc } from 'firebase/firestore';
import LoadingSpinner from 'renderer/components/LoadingSpinner';
import useModal from '../hooks/useModal';

// TODO: UI 꾸미고 confirm 창 같은 UI들도 다 꾸미기
const Project = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [projectDBData, setProjectDBData] = useState<DocumentData>();
  const { showModal } = useModal();

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

  const deleteProject = () => {
    showModal({
      text: "정말 이 프로젝트를 삭제할까요?",
      callback: (confirmed: boolean) => {
        confirmed && deleteDoc(doc(fireStore, "projects", projectId.current)).finally(() => {
          navigate("/");
          toast("프로젝트를 삭제했어요.", {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark"
          });
        });
      }
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

  return (
    <>
      <LoadingSpinner visible={!loaded}/>

      {(loaded && projectDBData) &&
        <>
          <h2>{projectDBData.title}</h2>
          <h2>{projectId.current}</h2>
          <Link to={`/project/${projectId.current}/edit`}><button>수정</button></Link>
          <button onClick={deleteProject}>삭제</button>
        </>

      }
    </>
  );
};

export default Project;
