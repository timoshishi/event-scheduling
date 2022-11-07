export const DialogClose = ({ closeDialog }: { closeDialog: () => void }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
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
        margin: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <span>X</span>
    </button>
  </div>
);
