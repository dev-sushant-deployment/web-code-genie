"use client";

import { useRouter } from "next/navigation";
import { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModelProps {
  children: React.ReactNode;
}

export const Auth : React.FC<ModelProps> = ({ children }) => {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="absolute top-0 left-0 flex justify-center items-center">
      <dialog ref={dialogRef} className="h-lvh w-lvw rounded-[12px] bg-transparent text-popover-foreground relative flex justify-center items-center backdrop-blur-md p-0 m-0" onClose={onDismiss}>
        {children}
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  );
}