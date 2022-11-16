import { createRef, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../styles/createAnimation.css";
import trashIcon from "../../../assets/svgs/trash.svg";

interface CreateProps {
  stickyAble: boolean;
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
  font-weight: 500;
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

const Create = ({ stickyAble }: CreateProps) => {
  const [questions, setQuestions] = useState([{
    id: Math.random(),
    nodeRef: createRef(),
    subject: "",
    content: "",
    _subjectInput: "",
    _contentInput: ""
  }, {
    id: Math.random(),
    nodeRef: createRef(),
    subject: "",
    content: "",
    _subjectInput: "",
    _contentInput: ""
  }, {
    id: Math.random(),
    nodeRef: createRef(),
    subject: "",
    content: "",
    _subjectInput: "",
    _contentInput: ""
  }, {
    id: Math.random(),
    nodeRef: createRef(),
    subject: "",
    content: "",
    _subjectInput: "",
    _contentInput: ""
  }, {
    id: Math.random(),
    nodeRef: createRef(),
    subject: "",
    content: "",
    _subjectInput: "",
    _contentInput: ""
  }] as any);

  const [isNavSticky, setIsNavSticky] = useState(false);

  const lastQuestionRef = useRef<HTMLElement>();

  const addQuestion = () => {
    const newQuestion = {
      id: Math.random(),
      nodeRef: createRef(),

      subject: "",
      content: "",
      _subjectInput: "",
      _contentInput: ""
    };
    setQuestions([...questions, newQuestion]);

    setTimeout(() => {
      lastQuestionRef.current?.focus();
      lastQuestionRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 0);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((value: any) => value.id !== id));
  };

  const editTempQuestionSubjectData = (index: number) => (e: any) => {
    const _questions = [...questions];
    _questions[index]._subjectInput = e.target.innerText;
    setQuestions(_questions);
  };

  const editTempQuestionContentData = (index: number) => (e: any) => {
    const _questions = [...questions];
    _questions[index]._contentInput = e.target.innerText;
    setQuestions(_questions);
  };

  const updateQuestionSubjectData = (index: number) => {
    const _questions = [...questions];
    _questions[index].subject = _questions[index]._subjectInput;
    setQuestions(_questions);
  };

  const updateQuestionContentData = (index: number) => {
    const _questions = [...questions];
    _questions[index].content = _questions[index]._contentInput;
    setQuestions(_questions);
  };

  const saveData = () => {
    toast('저장되었어요.', {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    setIsNavSticky(stickyAble);
  }, [stickyAble]);

  return (
    <CreateWrapper>
      <StickyNavBarBox sticky={isNavSticky} />
      <StickyNavBar sticky={isNavSticky}>
        <NavTitle>힌트지 만들기</NavTitle>
        <SaveButton onClick={saveData}>저장</SaveButton>
      </StickyNavBar>
      <Container>
        <NavBar sticky={isNavSticky}>
          <NavTitle>힌트지 만들기</NavTitle>
          <SaveButton onClick={saveData}>저장</SaveButton>
        </NavBar>
        <Input placeholder="제목을 입력하세요." type="text"/>

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
                    <QuestionInput ref={lastQuestionRef} contentEditable="true" aria-multiline="false" spellCheck="false" suppressContentEditableWarning={true} tabIndex={1} onInput={editTempQuestionSubjectData(i)} onBlur={() => updateQuestionSubjectData(i)}>{value.subject}</QuestionInput>
                    <QuestionInputBorder/>
                    <QuestionInputLabel>제목</QuestionInputLabel>
                  </QuestionInputWrapper>
                  <QuestionInputWrapper width="85%">
                    <QuestionInput role="textbox" contentEditable="true" aria-multiline="true" spellCheck="false" suppressContentEditableWarning={true} tabIndex={1} onInput={editTempQuestionContentData(i)} onBlur={() => updateQuestionContentData(i)}>{value.content}</QuestionInput>
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

        <SaveButton onClick={saveData} style={{height: "40px", lineHeight: "40px", marginBottom: "30px"}}>저장</SaveButton>
      </Container>
    </CreateWrapper>
  );
};

export default Create;
