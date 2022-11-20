import { CSSTransition } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import styled from "styled-components";
import { modalState } from 'renderer/recoil/ModalRecoil';
import "../styles/animations.css";
import useModal from 'renderer/hooks/useModal';
import { useState } from 'react';

const ModalWrapper = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 350px;
  max-width: 400px;
  min-height: 100px;
  background: #1E1E1E;
  border-radius: 5px;
  padding: 15px;
`;

const ModalText = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #FFFFFF;
`;

const ModalButtons = styled.div`
  margin-top: 10px;
`;

const ModalButton = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 8px 18px 8px 18px;

  font-weight: 500;
  font-size: 18px;
  color: #FFFFFF;

  float: right;

  margin-left: 10px;

  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const GlobalModal = () => {
  const { hideModal } = useModal();

  const { text, callback } = useRecoilState(modalState)[0] || {};

  const onConfirm = async () => {
    if (callback != undefined) {
      await callback(true);
    }
    hideModal();
  }

  const onCancel = async () => {
    if (callback != undefined) {
      await callback(false);
    }
    hideModal();
  }

  return (
    <CSSTransition in={(text != undefined) && (callback != undefined)} timeout={300} classNames="promptModalAnimation" unmountOnExit>
      <ModalWrapper>
        <ModalText>{text}</ModalText>
        <ModalButtons>
          <ModalButton onClick={onConfirm}>확인</ModalButton>
          <ModalButton onClick={onCancel}>취소</ModalButton>
        </ModalButtons>
      </ModalWrapper>
    </CSSTransition>
  );
};

export default GlobalModal;
