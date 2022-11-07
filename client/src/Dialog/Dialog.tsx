import { MouseEventHandler, useContext, useEffect, useRef } from 'react';
import { DialogContext } from '../context/DialogContext';
import { Event, ModalView } from '../types/client';
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 10,
        }}
      >
        <div
          id='dialog'
          style={{
            height: '40vh',
            width: '30vw',
            backgroundColor: 'white',
            opacity: '1',
            zIndex: 15,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <button
              type='button'
              aria-label='Close'
              onClick={closeDialog}
              style={{
                border: 'none',
                backgroundColor: 'inherit',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                padding: '0.5rem',
                margin: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <span>X</span>
            </button>
          </div>
          <div>
            <div>
              <h5>Modal title</h5>
            </div>
            <div>
              <p>Modal body text goes here.</p>
            </div>
            <div>
              <button type='button' onClick={closeDialog}>
                Close
              </button>
              <button type='button'>Submit</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
