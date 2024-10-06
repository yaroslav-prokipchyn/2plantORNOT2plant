import { useState } from 'react';

export function useModal(initialState?: boolean | (() => boolean)): [boolean, () => void, () => void] {
  const [open, setOpen] = useState(initialState ?? false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return [
    open,
    showModal,
    hideModal
  ]
}