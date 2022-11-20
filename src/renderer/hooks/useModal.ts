import { useRecoilState } from "recoil";
import { ModalType, modalState } from "../recoil/ModalRecoil";

export default function useModal() {
  const [modal, setModal] = useRecoilState(modalState);

  const showModal = ({ text, callback }: ModalType) => {
    setModal({ text, callback });
  };

  const hideModal = () => {
    setModal(null);
  };

  return {
    modal,
    setModal,
    showModal,
    hideModal
  };
}
