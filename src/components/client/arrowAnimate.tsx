"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ArrowAnimateProps {
  open: boolean;
}

export const ArrowAnimate: React.FC<ArrowAnimateProps> = ({ open }) => {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (arrowRef.current) {
      if (open) gsap.to(arrowRef.current, { duration: 0.3, rotation: -90 });
      else gsap.to(arrowRef.current, { duration: 0.3, rotation: 0 });
    }
  }, [open]);

  return (
    <div ref={arrowRef}>
      <ChevronDown
        size={18}
        color='gray'
      />
    </div>
  )
}