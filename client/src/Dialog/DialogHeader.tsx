import { ModalViewType } from '../context/DialogContext';
import { ModalView } from '../types/client.d';

export const DialogHeader = ({ viewType, eventName }: { viewType: ModalViewType; eventName?: string }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h3>{viewType === ModalView.CREATE ? 'Create a new event' : `Edit ${eventName}`}</h3>
  </div>
);
