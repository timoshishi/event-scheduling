import { MouseEventHandler, useContext, useEffect, useRef } from 'react';
import { DialogContext } from '../context/DialogContext';
import { Event, ModalView } from '../types/client';
import { DialogContent } from './DialogContent';
import { DialogButtonGroup } from './DialogButtonGroup';
import { DialogClose } from './DialogClose';
import { DialogHeader } from './DialogHeader';
import { Overlay } from './Overlay';

export interface DialogProps {
  event?: Event;
}

export const Dialog = ({ event }: DialogProps) => {
  const { closeDialog, isOpen, modalViewType } = useContext(DialogContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClickOutside: MouseEventHandler = (e) => {
    e.stopPropagation();
    e.bubbles = false;
    console.log(e.currentTarget, e.target);
    if (e.currentTarget.id === 'overlay') {
      closeDialog();
    }
  };

  useEffect(() => {
    if (dialogRef?.current) {
      dialogRef.current.open = isOpen;
    }
  }, [isOpen]);
  console.log('isOpen', isOpen);

  return (
    <>
      <Overlay isOpen={isOpen} handleClickOutside={handleClickOutside} />
      <dialog
        ref={dialogRef}
        style={{
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: 'none',
          borderRadius: '0.5rem',
          marginTop: '10vh',
          height: '45vh',
          width: '30vw',
        }}
      >
        <DialogClose closeDialog={closeDialog} />
        <DialogHeader viewType={modalViewType} eventName={event?.eventName} />
        <DialogContent />
        <DialogButtonGroup closeDialog={closeDialog} />
      </dialog>
    </>
  );
};
