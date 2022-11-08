import { ModalViewType } from '../context/DialogContext';
import { ModalView } from '../types/client.d';

export const DialogHeader = ({ viewType, eventName }: { viewType: ModalViewType; eventName?: string }) => (
  <div>
    <h3 style={{ margin: '0' }}>{viewType === ModalView.CREATE ? 'Create a new event' : `Edit ${eventName}`}</h3>
  </div>
);
