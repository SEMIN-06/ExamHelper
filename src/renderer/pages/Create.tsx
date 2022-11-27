import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';
import { setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { fireStore, storage } from '../Firebase';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import usePrompt from "../hooks/useBlockerPrompt";
import LoadingSpinner from "../components/LoadingSpinner";
import { useHotkeys } from 'react-hotkeys-hook';
import { ContentEditable } from '../components/ContentEditable';

import { FiTrash, FiUnderline } from 'react-icons/fi';
import { BiHighlight, BiImageAdd } from 'react-icons/bi';
import { BsTypeBold } from 'react-icons/bs';

import "../styles/animations.css";
import 'react-toastify/dist/ReactToastify.css';
import { render } from "@testing-library/react";

interface IQuestion {
  [key: string]: any;
	id?: number;
  nodeRef?: any;
  subject: string;
  content: string;
  meaning: string;
  attachImage?: string;
}

const CreateWrapper = styled.div`
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1800px;
  width: 90%;
  height: fit-content;
`;

const NavBar = styled.div<{sticky: boolean}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #2C2C2C;
  opacity: ${props => props.sticky ? 0 : 1};
  top: 0;
  margin-top: 55px;
  margin-bottom: 55px;
  overflow: hidden;
`;

const NavTitle = styled.div`
  font-weight: 900;
  font-size: 30px;
  color: #FFFFFF;
`

const NavBackLink = styled(Link)`
  font-weight: 600;
  font-size: 14px;
  color: #FFFFFF;
  text-decoration: none;

  &:hover {
    color: #6170F1;
  };

  transition: color 0.1s ease;
`

const SaveButton = styled.div`
  width: 78px;
  height: 32px;

  background: #4255FF;
  border-radius: 5px;

  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  line-height: 32px;
  text-align: center;
  color: #FFFFFF;

  cursor: pointer;

  margin-left: auto;
  order: 2;

  &:hover {
    background: #364aff;
  };

  &:active {
    background: #1f35fc;
  }
`;

const StickyNavBarBox = styled.div<{sticky: boolean}>`
  display: flex;
  align-items: center;
  width: 99.4%;
  height: 80px;
  background: #2C2C2C;
  opacity: ${props => props.sticky ? 1 : 0};
  position: fixed;
  top: 38px;
  z-index: 1000;
  box-shadow: 0 0.25rem 1rem 0 rgb(0 0 0 / 16%);
`;

const StickyNavBar = styled.div<{sticky: boolean}>`
  display: flex;
  align-items: center;
  max-width: 1300px;
  width: 89.3%;
  height: 80px;
  background: transparent;
  opacity: ${props => props.sticky ? 1 : 0};
  position: fixed;
  top: 38px;
  z-index: 1001;
`;

const Input = styled.input`
  width: calc(100% - 10px);
  height: 42px;
  background: #D9D9D9;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
  font-weight: 500;
  font-size: 15px;
  padding-left: 10px;

  border: 0;
  outline: none;
  border-radius: 10px;

  color: #1E1E1E;

  margin-bottom: 20px;
`;

const QuestionToolBar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  padding-left: 15px;
  padding-right: 15px;

  height: 47px;

  background: #D9D9D9;
  border-radius: 10px 10px 0px 0px;
`;

const QuestionNumber = styled.div`
  font-weight: 500;
  font-size: 18px;

  color: #1E1E1E;
`;

const TrashButton = styled(FiTrash)<{disabled?: boolean}>`
  cursor: pointer;
  transition: color .12s ease-in-out;

  &:hover {
    color: #6170F1;
  };

  ${props => props.disabled && css`
    &:hover {
      color: black;
    };

    cursor: not-allowed;
  `}
`;

const EditToolBar = styled.div`
  display: flex;
  align-items: center;

  background: #1E1E1E;
  padding: 5px 5px 5px 13px;
  border-radius: 20px;

  color: white;

  visibility: hidden;
  opacity: 0;
  transition: all .1s ease-in-out;
`;

const EditToolButton = styled.button`
  display: flex;
  align-items: center;

  background: transparent;
  border: none;
  color: white;
  padding: 1px;
  cursor: pointer;
  margin-right: 10px;

  svg {
    cursor: pointer;
  }

  &:hover svg {
    color: #6170F1;
  }
`;

const QuestionWrapper = styled.div`
  width: 100%;
  min-height: 161px;
  height: fit-content;
  margin-bottom: 10px;

  &:focus-within ${EditToolBar}{
    visibility: visible;
    opacity: 1;
  }
`;

const QuestionContent = styled.div`
  min-height: 112px;
  height: fit-content;
  margin-top: 2px;

  background: #D9D9D9;
  border-radius: 0px 0px 10px 10px;

  display: flex;

  padding-left: 5px;
  padding-right: 15px;
`;

const QuestionInputWrapper = styled.div<{width: string}>`
  width: ${props => props.width};
  height: fit-content;
  margin-left: 10px;
  margin-top: 38px;
  margin-bottom: 32px;
`;

const QuestionInput = styled(ContentEditable)`
  width: 100%;
  height: fit-content;
  background: transparent;
  font-weight: 500;
  font-size: 15px;

  border: 0;
  outline: none;

  color: #1E1E1E;

  white-space: pre-wrap;
`;

const QuestionInputBorder = styled.div`
  box-shadow: 0 1.5px 0 0 #151515;
  height: 3px;

  ${QuestionInput}:focus-within ~ & {
    box-shadow: 0 3px 0 0 #6170F1;
  };

  transition: all .12s cubic-bezier(.47,0,.745,.715);
`;

const QuestionInputLabel = styled.span`
  font-weight: 700;
  font-size: 14px;

  color: #1E1E1E;
`;

const NewQuestionWrapper = styled.div`
  width: 100%;
  height: 112px;

  background: #D9D9D9;
  border-radius: 10px;

  display: flex;
  align-items: center;

  cursor: pointer;

  margin-bottom: 30px;
`;

const NewQuestionNumber = styled.div`
  font-weight: 700;
  font-size: 36px;

  color: #7C7C7C;

  margin-left: 40px;
`;

const NewQuestionTextInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  width: 100%;
  height: 100%;
`;

const NewQuestionText = styled.div`
  font-weight: 500;
  font-size: 20px;

  color: #222222;

  box-shadow: 0 3px 0 0 #151515;

  display: absolute;
  transform: translateX(-50%);

  ${NewQuestionWrapper}:hover & {
    color: #6170F1;
    box-shadow: 0 3px 0 0 #6170F1;
  };

  transition: all .12s cubic-bezier(.47,0,.745,.715);
`;

const UploadImageWrapper = styled.div<{ visible: boolean; }>`
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgb(30, 30, 30);
  border-radius: 5px;
  padding: 15px 15px 15px 15px;

  display: ${props => props.visible ? "block" : "none"};
`;

const Create = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>(params.projectId ? params.projectId : (Math.random() + 1).toString(36).substring(7));
  const [loaded, setLoaded] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [naviBlocked, setNaviBlocked] = useState<boolean>(false);

  usePrompt("저장 되지 않은 항목이 있어요. 정말 나갈까요?", naviBlocked);

  const [isNavSticky, setIsNavSticky] = useState(false);

  const subjectInputRef = useRef<HTMLInputElement>(null);
  const questionsCbRef = useRef<() => void | undefined>();

  const createNewQuestion = (subject: string = "", meaning: string = "", content: string = "", attachImage: string = ""): IQuestion => {
    const newQuestion: IQuestion = {
      id: Math.random(),
      nodeRef: createRef(),

      subject: subject,
      meaning: meaning,
      content: content,
      attachImage: attachImage
    };
    return newQuestion;
  };

  const [questions, setQuestions] = useState<IQuestion[]>([
    createNewQuestion(), createNewQuestion(), createNewQuestion(), createNewQuestion(), createNewQuestion()
  ]);

  const addQuestion = () => {
    const newQuestion: IQuestion = createNewQuestion();
    setQuestions([...questions, newQuestion]);

    questionsCbRef.current = () => {
      const element = newQuestion.nodeRef.current.getElementsByClassName("subjectInput")[0] as HTMLElement;
      element.focus();
      element.scrollIntoView({behavior: 'smooth'});
    }
  };

  useEffect(() => {
    if (questionsCbRef.current) {
      questionsCbRef.current();
      questionsCbRef.current = undefined;
    }
  }, [questions]);

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((value: any) => value.id !== id));
  };

  const updateQuestionInputData = (type: string, index: number, e: any) => {
    const _questions = [...questions];

    _questions[index][type] = e.target.value;
    setQuestions(_questions);

    setNaviBlocked(true);
  };

  const saveData = async () => {
    const toastId = toast.loading("저장 중...", {
      position: "bottom-left",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark"
    });

    if (subjectInputRef.current?.value == "") {
      toast.update(toastId, {
        render: "프로젝트의 제목이 입력되지 않았어요.",
        isLoading: false,
        autoClose: 2000,
      });
      subjectInputRef.current?.focus();
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const _value = questions[i];
      if (_value.subject == "") {
        toast.update(toastId, {
          render: "제목이 입력되지 않은 문제가 있어요.",
          isLoading: false,
          autoClose: 2000,
        });
        const element = _value.nodeRef.current.getElementsByClassName("subjectInput")[0] as HTMLElement;
        element.focus();
        return
      } else if (_value.meaning == "" && _value.content == "") {
        toast.update(toastId, {
          render: "뜻과 내용이 입력되지 않은 문제가 있어요.",
          isLoading: false,
          autoClose: 2000,
        });
        const element = _value.nodeRef.current.getElementsByClassName("meaningInput")[0] as HTMLElement;
        element.focus();

        return
      }

      const uploadImageElement = _value.nodeRef.current.getElementsByClassName("uploadImageInput")[0] as HTMLInputElement;
      let attachmentURL = "";
      if (uploadImageElement.files && (uploadImageElement.files.length > 0)) {
        const file = uploadImageElement.files[0];

        const metadata = {
          contentType: file.type
        };

        const storageRef = ref(storage, "uploaedQuestionImages/" + Math.floor(Math.random() * 1000).toString() + file.name);
        await uploadBytes(storageRef, file, metadata).then(async (snapshot) => {
          console.log('Uploaded a blob or file!');
          await getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            attachmentURL = downloadURL;

            uploadImageElement.value = "";
          }).catch((e) => {
            console.log("upload file error " + e);
          });
        });
      }

      if (attachmentURL != "") {
        if (_value.attachImage != "") {
          const storageRef = ref(storage, _value.attachImage);
          await deleteObject(storageRef).then(() => {
            console.log("Old image file deleted");
          }).catch((e) => {
            console.log("deleted file error " + e);
          });
        }

        _value.attachImage = attachmentURL;
      } else {
        if ((_value.nodeRef.current.getElementsByClassName("deleteImageInput")[0] as HTMLInputElement).value == "yes") {
          (_value.nodeRef.current.getElementsByClassName("deleteImageInput")[0] as HTMLInputElement).value = "no";
          const storageRef = ref(storage, _value.attachImage);
          await deleteObject(storageRef).then(() => {
            console.log("User request image file deleted");
          }).catch((e) => {
            console.log("user request deleted file error " + e);
          });
          _value.attachImage = "";
        };
      }
    }

    const _questionsfordb: IQuestion[] = [];
    questions.map((value: any, i: number) => {
      _questionsfordb[i] = {
        id: value.id,
        subject: value.subject,
        content: value.content,
        meaning: value.meaning,
        attachImage: value.attachImage
      }
    });

    const docRef = doc(fireStore, "projects", projectId.current);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setNaviBlocked(false);
      await updateDoc(docRef, {
        title: subjectInputRef.current?.value,
        editAt: Date.now(),
        questions: _questionsfordb
      }).finally(() => {
        toast.update(toastId, {
          render: "저장을 완료했어요.",
          isLoading: false,
          autoClose: 2000,
        });
      });
    } else {
      setNaviBlocked(false);
      await setDoc(docRef, {
        title: subjectInputRef.current?.value,
        createdAt: Date.now(),
        editAt: Date.now(),
        questions: _questionsfordb
      }).finally(() => {
        navigate(`/project/${projectId.current}`);
        toast.update(toastId, {
          render: "프로젝트가 생성되었어요.",
          isLoading: false,
          autoClose: 2000,
        });
      });
    }
  };

  const [projectDbValue, projectDbLoading, projectDbError] = useDocumentOnce(doc(fireStore, "projects", projectId.current));
  useEffect(() => {
    if (!projectDbLoading) {
      if (projectDbValue) {
        if (projectDbValue.data()?.questions) {
          const _questions = Object.values(projectDbValue.data()?.questions);
          if (_questions.length > 0) {
            const _questionsfordb: IQuestion[] = [];
            _questions.map((value: any, i: number) => {
              _questionsfordb[i] = createNewQuestion(value.subject, value.meaning, value.content, value.attachImage);
            });
            setQuestions(Object.values(_questionsfordb));
            setCreated(true);
            setLoaded(true);
          }
        }
      }
      setLoaded(true);
    }
  }, [projectDbLoading]);

  useHotkeys('ctrl+s', () => {
    saveData();
  }, [questions]);

  const handleScroll = () => {
    if (document.getElementById('app')?.scrollTop as number >= 50) {
      !isNavSticky && setIsNavSticky(true);
    } else {
      setIsNavSticky(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener('scroll', handleScroll, { capture: true });
    }, 100);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const NavBarContent = () => {
    return (
      <>
        {created
          ? <NavBackLink to={`/project/${projectId.current}`}>{"< 프로젝트로 돌아가기"}</NavBackLink>
          : <NavTitle>프로젝트 만들기</NavTitle>
        }
        <SaveButton onClick={saveData}>{created ? "저장" : "만들기"}</SaveButton>
      </>
    )
  };

  const setTextDesign = (event: any, type: string) => {
    event.preventDefault();
    if (type == "highlight") {
      const colour = document.queryCommandValue("backColor");
      if (colour === 'rgb(247, 224, 72)') {
          document.execCommand("hiliteColor", false, "transparent");
      } else {
          document.execCommand("hiliteColor", false, "#f7e048");
      }
    } else {
      document.execCommand(type);
    }
  };

  const [uploadImageVisible, setUploadImageVisible] = useState<boolean[]>([]);

  return (
    <CreateWrapper>
      <LoadingSpinner visible={projectDbLoading && !loaded}/>

      <StickyNavBarBox sticky={isNavSticky} />
      <StickyNavBar sticky={isNavSticky}><NavBarContent/></StickyNavBar>

      {(!projectDbLoading && loaded) &&
        <Container onClick={() => setUploadImageVisible([])}>
          <NavBar sticky={isNavSticky}><NavBarContent/></NavBar>
          <Input placeholder="제목을 입력하세요." type="text" spellCheck="false" ref={subjectInputRef} defaultValue={projectDbValue?.data()?.title} tabIndex={1} onInput={() => setNaviBlocked(true)}/>
          <TransitionGroup>
            {questions.map((value: any, i: number) => (
              <CSSTransition key={value.id} nodeRef={value.nodeRef} timeout={200} classNames="questionAnimation">
                <QuestionWrapper ref={value.nodeRef}>
                  <UploadImageWrapper visible={uploadImageVisible[i]} onClick={(e: any) => e.stopPropagation()}>
                    <input className="uploadImageInput" type="file" accept=".png,.jpg,.gif,.bmp" style={{ width: "200px" }} onChange={() => {(value.nodeRef.current.getElementsByClassName("deleteImageInput")[0] as HTMLInputElement).value = "no"; setNaviBlocked(true);}}></input>
                    <input type="hidden" className="deleteImageInput"></input>
                    <button onClick={() => {(value.nodeRef.current.getElementsByClassName("deleteImageInput")[0] as HTMLInputElement).value = "yes"}}>삭제</button>
                    <br></br>
                    {value.attachImage != "" && <img src={value.attachImage} style={{maxWidth: "30%", maxHeight: "30%"}} />}
                  </UploadImageWrapper>
                  <QuestionToolBar>
                    <QuestionNumber>{i + 1}</QuestionNumber>
                    <EditToolBar>
                      <EditToolButton onMouseDown={(e: any) => setTextDesign(e, "bold")} style={{marginRight: "5px"}}>
                        <BsTypeBold size={"22px"}/>
                      </EditToolButton>

                      <EditToolButton onMouseDown={(e: any) => setTextDesign(e, "highlight")}>
                        <BiHighlight size={"22px"}/>
                      </EditToolButton>

                      <EditToolButton onMouseDown={(e: any) => setTextDesign(e, "underline")}>
                        <FiUnderline size={"22px"}/>
                      </EditToolButton>

                      <EditToolButton onClick={(e: any) => {
                        e.stopPropagation();
                        const _uploadImageVisible = [...uploadImageVisible];
                        _uploadImageVisible[i] = true;
                        setUploadImageVisible(_uploadImageVisible);
                      }}>
                        <BiImageAdd size={"22px"} />
                      </EditToolButton>
                    </EditToolBar>
                    {(questions.length > 1) ? <TrashButton size={"18px"} onClick={() => {setNaviBlocked(true); deleteQuestion(value.id);}}/> : <TrashButton size={"18px"} disabled={true} />}
                  </QuestionToolBar>
                  <QuestionContent>
                    <QuestionInputWrapper width="10%">
                      <QuestionInput
                        html={value.subject}
                        className="subjectInput"
                        tabIndex={1}
                        onChange={(e: any) => updateQuestionInputData("subject", i, e)}
                      />
                      <QuestionInputBorder/>
                      <QuestionInputLabel>제목</QuestionInputLabel>
                    </QuestionInputWrapper>
                    <QuestionInputWrapper width="25%">
                      <QuestionInput
                        html={value.meaning}
                        className="meaningInput"
                        tabIndex={1}
                        onChange={(e: any) => updateQuestionInputData("meaning", i, e)}
                      />
                      <QuestionInputBorder/>
                      <QuestionInputLabel>뜻</QuestionInputLabel>
                      </QuestionInputWrapper>
                    <QuestionInputWrapper width="65%">
                      <QuestionInput
                        html={value.content}
                        className="contentInput"
                        tabIndex={1}
                        onChange={(e: any) => updateQuestionInputData("content", i, e)}
                      />
                      <QuestionInputBorder/>
                      <QuestionInputLabel>내용</QuestionInputLabel>
                    </QuestionInputWrapper>
                  </QuestionContent>
                </QuestionWrapper>
              </CSSTransition>
            ))}
          </TransitionGroup>

          <NewQuestionWrapper onClick={addQuestion} onFocus={addQuestion} tabIndex={1}>
            <NewQuestionNumber>{(questions.length) + 1}</NewQuestionNumber>
            <NewQuestionTextInner>
              <NewQuestionText>카드 추가</NewQuestionText>
            </NewQuestionTextInner>
          </NewQuestionWrapper>

          <SaveButton onClick={saveData} style={{height: "40px", lineHeight: "40px", marginBottom: "30px"}}>{created ? "저장" : "만들기"}</SaveButton>
        </Container>
      }
    </CreateWrapper>
  );
};

export default Create;
