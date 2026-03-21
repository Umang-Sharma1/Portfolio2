'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  setModalOpen: () => {},
});

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>{children}</ModalContext.Provider>
  );
};
