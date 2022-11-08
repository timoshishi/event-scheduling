import { MouseEventHandler, useContext, useEffect, useRef } from 'react';
import { DialogContext } from '../context/DialogContext';
import { Event } from '../types/client';
import { DialogContent } from './DialogContent';
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
    if (e.currentTarget.id === 'overlay') {
      closeDialog();
    }
  };

  useEffect(() => {
    if (dialogRef?.current) {
      dialogRef.current.open = isOpen;
    }
  }, [isOpen]);

  return (
    <>
      <Overlay isOpen={isOpen} handleClickOutside={handleClickOutside} />
      <dialog
        ref={dialogRef}
        style={{
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
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
        <DialogContent
          closeDialog={closeDialog}
          event={{
            id: event?.id || 23,
            eventName: event?.eventName || '',
            eventStart: event?.eventStart || new Date().toISOString(),
            eventEnd: event?.eventEnd || new Date().toISOString(),
          }}
        />
      </dialog>
    </>
  );
};
