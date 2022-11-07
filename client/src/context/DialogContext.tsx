import { ReactElement, createContext, useState } from 'react';

export const DialogContext = createContext({
  openDialog: () => {},
  closeDialog: () => {},
  toggleDialog: () => {},
  isOpen: false,
});

export const DialogProvider = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    console.log('closeDialog called');
    setIsOpen(() => false);
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, toggleDialog, isOpen }}>
      {children}
    </DialogContext.Provider>
  );
};
