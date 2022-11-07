import { MouseEventHandler } from 'react';

export const Overlay = ({ isOpen, handleClickOutside }: { isOpen: boolean; handleClickOutside: MouseEventHandler }) => {
  return (
    <div
      id='overlay'
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        padding: '0',
        margin: '0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
        display: isOpen ? 'flex' : 'none',
      }}
      onClick={handleClickOutside}
    />
  );
};
