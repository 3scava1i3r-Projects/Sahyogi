"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.pageX;
      mouseYRef.current = e.pageY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.pageX - 4}px, ${e.pageY - 4}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }

        body {
          cursor: none !important;
        }

        .custom-cursor {
          width: 8px;
          height: 8px;
          background-color: #8a8a8a;
          border-radius: 50%;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>

      <div className="custom-cursor" ref={cursorRef} />
    </>
  );
}
