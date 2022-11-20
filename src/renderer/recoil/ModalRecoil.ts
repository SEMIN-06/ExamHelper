import { atom } from "recoil";

export interface ModalType {
  text: string;
  callback: (...arg: any[]) => any;
}

export const modalState = atom<ModalType | null>({
  key: "modalState",
  default: null
});
