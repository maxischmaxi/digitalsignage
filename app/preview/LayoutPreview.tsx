"use client";

import { fabric } from "fabric";
import { Layout } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

type Props = {
  layout: Layout;
};

export function LayoutPreview(props: Props) {
  const { layout } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function onRightClick(event: MouseEvent) {
      event.preventDefault();
    }

    window.addEventListener("contextmenu", onRightClick);

    return () => {
      window.removeEventListener("contextmenu", onRightClick);
    };
  }, []);

  useEffect(() => {
    function handleSize() {
      if (!wrapperRef.current) {
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }

    handleSize();

    window.addEventListener("resize", handleSize);
    window.addEventListener("orientationchange", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
      window.removeEventListener("orientationchange", handleSize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (fabricRef.current) {
      fabricRef.current.setWidth(width);
      fabricRef.current.setHeight(height);
      fabricRef.current.loadFromJSON(layout.data, () => {});
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: false,
      interactive: false,
      moveCursor: "default",
      hoverCursor: "default",
      defaultCursor: "default",
      rotationCursor: "default",
      notAllowedCursor: "default",
      freeDrawingCursor: "default",
    });

    canvas.loadFromJSON(layout.data, () => {});

    fabricRef.current = canvas;
  }, [height, layout.data, width]);

  return (
    <div ref={wrapperRef} className="wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
}
