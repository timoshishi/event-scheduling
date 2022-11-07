import React from 'react';

export const DialogButtonGroup = ({ closeDialog }: { closeDialog: () => void }) => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <button type='button' style={{ marginLeft: '1rem', marginRight: '1rem' }} onClick={closeDialog}>
      Close
    </button>
    <button type='button' style={{ marginLeft: '1rem', marginRight: '1rem' }}>
      Submit
    </button>
  </div>
);
