import { useContext, useEffect, useRef } from 'react';
import { DialogContext } from './context/DialogContext';

enum ModalView {
  'EDIT' = 'EDIT',
  'CREATE' = 'CREATE',
}

export const Dialog = ({}) => {
  const { closeDialog, isOpen } = useContext(DialogContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClickOutside = (e: any) => {
    console.log(e.currentTarget.id);
    if (e.currentTarget.id !== 'dialog') {
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
    <dialog
      ref={dialogRef}
      onClick={handleClickOutside}
      style={{
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10000,
        display: isOpen ? 'flex' : 'none',
      }}
    >
      <div
        id='dialog'
        style={{
          height: '40vh',
          width: '30vw',
          backgroundColor: 'white',
          opacity: '1',
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
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Modal title</h5>
          </div>
          <div className='modal-body'>
            <p>Modal body text goes here.</p>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
              Close
            </button>
            <button type='button' className='btn btn-primary'>
              Submit
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
