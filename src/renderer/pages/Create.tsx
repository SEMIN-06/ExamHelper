import { createRef, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';
import { setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { fireStore } from '../Firebase';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import usePrompt from "../hooks/useBlockerPrompt";
import LoadingSpinner from "../components/LoadingSpinner";
import { useHotkeys } from 'react-hotkeys-hook';

import trashIcon from "../../../assets/svgs/trash.svg";
import "../styles/animations.css";
import 'react-toastify/dist/ReactToastify.css';

interface IQuestion {
  [key: string]: any;
	id?: number;
  nodeRef?: any;
  subject: string;
  content: string;
  meaning: string;
  inputs?: any;
}

const CreateWrapper = styled.div`
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1300px;
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
  font-weight: 500;
  font-size: 15px;
  padding-left: 10px;

  border: 0;
  outline: none;
  border-radius: 10px;

  color: #1E1E1E;

  margin-bottom: 20px;
`;

const TrashButton = styled.img`
  margin-left: auto;
  order: 2;
  cursor: pointer;
`;

const QuestionWrapper = styled.div`
  width: 100%;
  min-height: 161px;
  height: fit-content;
  margin-bottom: 10px;
`;

const QuestionToolBar = styled.div`
  display: flex;
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
  margin-top: 35px;
  margin-bottom: 30px;
`;

const QuestionInput = styled.div`
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

const Create = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = useRef<string>(params.projectId ? params.projectId : (Math.random() + 1).toString(36).substring(7));
  const [loaded, setLoaded] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [naviBlocked, setNaviBlocked] = useState<boolean>(false);

  usePrompt("저장 되지 않은 항목이 있어요. 정말 나갈까요?", naviBlocked);

  const [isNavSticky, setIsNavSticky] = useState(false);

  const SubjectInputRef = useRef<HTMLInputElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  const createNewQuestion = (subject: string = "", meaning: string = "", content: string = ""): IQuestion => {
    const newQuestion: IQuestion = {
      id: Math.random(),
      nodeRef: createRef(),

      subject: subject,
      meaning: meaning,
      content: content,
      inputs: {
        subject: subject,
        meaning: meaning,
        content: content
      }
    };
    return newQuestion;
  };

  const [questions, setQuestions] = useState<IQuestion[]>([
    createNewQuestion(), createNewQuestion(), createNewQuestion(), createNewQuestion(), createNewQuestion()
  ]);

  const addQuestion = () => {
    const newQuestion: IQuestion = createNewQuestion();
    setQuestions([...questions, newQuestion]);

    setTimeout(() => {
      lastQuestionRef.current?.focus();
      lastQuestionRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 0);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((value: any) => value.id !== id));
  };

  const updateQuestionInputData = (type: string, index: number) => (e: any) => {
    const _questions = [...questions];

    _questions[index].inputs[type] = e.target.innerText;
    setQuestions(_questions);

    setNaviBlocked(true);
  };

  const updateQuestionData = (type: string, index: number) => {
    const _questions = [...questions];
    _questions[index][type] = _questions[index].inputs[type];
    setQuestions(_questions);
  };

  const saveData = async () => {
    if (SubjectInputRef.current?.value == "") {
      toast("프로젝트의 제목이 입력되지 않았어요.", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      SubjectInputRef.current?.focus();
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const _value = questions[i];
      if (_value.subject == "") {
        toast("제목이 입력되지 않은 문제가 있어요.", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        const element = _value.nodeRef.current.getElementsByClassName("subjectInput")[0] as HTMLElement;
        element.focus();
        return
      } else if (_value.meaning == "") {
        toast("뜻이 입력되지 않은 문제가 있어요.", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        const element = _value.nodeRef.current.getElementsByClassName("meaningInput")[0] as HTMLElement;
        element.focus();
        return
      }
    }

    const _questionsfordb: IQuestion[] = [];
    questions.map((value: any, i: number) => {
      _questionsfordb[i] = {
        subject: value.subject,
        content: value.content,
        meaning: value.meaning
      }
    });

    const docRef = doc(fireStore, "projects", projectId.current);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const toastId = toast.loading("저장 중...", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });

      setNaviBlocked(false);
      await updateDoc(docRef, {
        title: SubjectInputRef.current?.value,
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
      const toastId = toast.loading("저장 중...", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });

      setNaviBlocked(false);
      await setDoc(docRef, {
        title: SubjectInputRef.current?.value,
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
              _questionsfordb[i] = createNewQuestion(value.subject, value.meaning, value.content);
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

  return (
    <CreateWrapper>
      <LoadingSpinner visible={projectDbLoading && !loaded}/>

      <StickyNavBarBox sticky={isNavSticky} />
      <StickyNavBar sticky={isNavSticky}><NavBarContent/></StickyNavBar>

      {(!projectDbLoading && loaded) &&
        <Container>
          <NavBar sticky={isNavSticky}><NavBarContent/></NavBar>
          <Input placeholder="제목을 입력하세요." type="text" spellCheck="false" ref={SubjectInputRef} defaultValue={projectDbValue?.data()?.title} onInput={() => setNaviBlocked(true)}/>

          <TransitionGroup>
            {questions.map((value: any, i: number) => (
              <CSSTransition key={value.id} nodeRef={value.nodeRef} timeout={200} classNames="questionAnimation">
                <QuestionWrapper ref={value.nodeRef}>
                  <QuestionToolBar>
                    <QuestionNumber>{i + 1}</QuestionNumber>
                    {(questions.length > 1) ? <TrashButton src={trashIcon} onClick={() => deleteQuestion(value.id)}/> : <TrashButton src={trashIcon} style={{cursor: "not-allowed"}}/>}
                  </QuestionToolBar>
                  <QuestionContent>
                    <QuestionInputWrapper width="15%">
                      <QuestionInput ref={lastQuestionRef} className="subjectInput" contentEditable="true" aria-multiline="false" spellCheck="false" suppressContentEditableWarning={true} tabIndex={1} onInput={updateQuestionInputData("subject", i)} onBlur={() => updateQuestionData("subject", i)}>{value.subject}</QuestionInput>
                      <QuestionInputBorder/>
                      <QuestionInputLabel>제목</QuestionInputLabel>
                    </QuestionInputWrapper>
                    <QuestionInputWrapper width="20%">
                      <QuestionInput className="meaningInput" role="textbox" contentEditable="true" aria-multiline="true" spellCheck="false" suppressContentEditableWarning={true} tabIndex={1} onInput={updateQuestionInputData("meaning", i)} onBlur={() => updateQuestionData("meaning", i)}>{value.meaning}</QuestionInput>
                      <QuestionInputBorder/>
                      <QuestionInputLabel>뜻</QuestionInputLabel>
                    </QuestionInputWrapper>
                    <QuestionInputWrapper width="65%">
                      <QuestionInput className="contentInput" role="textbox" contentEditable="true" aria-multiline="true" spellCheck="false" suppressContentEditableWarning={true} tabIndex={1} onInput={updateQuestionInputData("content", i)} onBlur={() => updateQuestionData("content", i)}>{value.content}</QuestionInput>
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
