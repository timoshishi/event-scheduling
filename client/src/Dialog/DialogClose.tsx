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
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        marginTop: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <span>X</span>
    </button>
  </div>
);
