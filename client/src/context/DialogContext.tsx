import { type } from '@testing-library/user-event/dist/type';
import { ReactElement, createContext, useState } from 'react';
import { ModalView } from '../types/client';

export const DialogContext = createContext({
  openDialog: (viewType: ModalViewType) => {},
  closeDialog: () => {},
  isOpen: false,
  setModalView: (viewType: ModalViewType) => {},
  modalViewType: null as ModalViewType,
});

export type ModalViewType = ModalView.EDIT | ModalView.CREATE | null;

export const DialogProvider = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalViewType, setModalViewType] = useState<ModalViewType>(null);

  const openDialog = (viewType: ModalViewType) => {
    setIsOpen(true);
    setModalView(viewType);
  };

  const closeDialog = () => {
    setIsOpen(() => false);
  };

  const setModalView = (viewType: ModalViewType) => {
    setModalViewType(viewType);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, isOpen, modalViewType, setModalView }}>
      {children}
    </DialogContext.Provider>
  );
};
