"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLayout } from "@/hooks/use-layout";
import { useSaveLayout } from "@/hooks/use-create-layout";
import { fabric } from "fabric";
import { Save, Square, Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { queryclient } from "@/components/query-provider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useDisplays } from "@/hooks/use-displays";
import { Prisma } from "@prisma/client";
import { useTheme } from "next-themes";

type Display = Prisma.DisplayGetPayload<{
  include: { Location: true };
}>;

type Props = {
  layoutId?: string;
};

export function LayoutEditor({ layoutId }: Props) {
  const { orgId = "" } = useParams();
  const t = useTranslations("LayoutEditor");
  const router = useRouter();
  const layout = useLayout(layoutId);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const saveLayout = useSaveLayout();
  const displays = useDisplays();
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null);
  const { theme, systemTheme } = useTheme();
  const isMiddleMouseDown = useRef<boolean>(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (!fabricRef.current) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        const objects = fabricRef.current.getActiveObjects();
        for (let i = 0; i < objects.length; i++) {
          fabricRef.current.remove(objects[i]);
        }

        fabricRef.current.discardActiveObject();
        return;
      }

      if (event.metaKey && event.key === "g") {
        event.preventDefault();

        const objects = fabricRef.current.getActiveObjects();
        if (!objects.length) return;

        const group = new fabric.Group(objects, {
          originX: "center",
          originY: "center",
        });

        fabricRef.current.discardActiveObject();

        for (let i = 0; i < objects.length; i++) {
          fabricRef.current.remove(objects[i]);
        }

        fabricRef.current.add(group);
        return;
      }
    }

    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) {
      return;
    }

    if (layout.data) {
      fabricRef.current.loadFromJSON(layout.data.data, () => {});
    }
  }, [layout.data]);

  useEffect(() => {
    if (!fabricRef.current) {
      return;
    }

    if (saveLayout.isPending) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.selection = false;
      fabricRef.current.renderAll();
    } else {
      fabricRef.current.selection = true;
    }
  });

  useEffect(() => {
    if (!fabricRef.current) {
      return;
    }

    const displayPreview = fabricRef.current
      .getObjects()
      .find((obj) => obj.name === "displayPreview");

    const stroke =
      theme === "dark"
        ? "white"
        : theme === "system"
          ? systemTheme === "dark"
            ? "white"
            : "black"
          : "black";

    if (selectedDisplay !== null && displayPreview) {
      displayPreview.set({
        stroke,
      });
    } else if (selectedDisplay !== null && !displayPreview) {
      fabricRef.current.add(
        new fabric.Rect({
          width: selectedDisplay.screenWidth,
          height: selectedDisplay.screenHeight,
          left: 0,
          top: 0,
          fill: "transparent",
          stroke,
          strokeWidth: 1,
          name: "displayPreview",
          selectable: false,
          evented: false,
        }),
      );
    } else if (displayPreview && selectedDisplay === null) {
      fabricRef.current.remove(displayPreview);
    }

    fabricRef.current.renderAll();
  }, [selectedDisplay, systemTheme, theme]);

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
    if (!fabricRef.current) {
      return;
    }

    if (saveLayout.isPending) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.selection = false;
      fabricRef.current.renderAll();
    } else {
      fabricRef.current.selection = true;
    }
  }, [saveLayout.isPending]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (fabricRef.current) {
      fabricRef.current.setWidth(width);
      fabricRef.current.setHeight(height);
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      selection: false,
    });

    canvas.on("mouse:down", (opt) => {
      if (opt.e.button === 1) {
        isMiddleMouseDown.current = true;
        lastPos.current = { x: opt.e.clientX, y: opt.e.clientY };
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    });

    canvas.on("mouse:move", (opt) => {
      if (!isMiddleMouseDown.current) {
        return;
      }

      const vpt = canvas.viewportTransform;
      if (!vpt) {
        return;
      }

      const moveX = opt.e.clientX - lastPos.current.x;
      const moveY = opt.e.clientY - lastPos.current.y;

      vpt[4] += moveX;
      vpt[5] += moveY;

      canvas.setViewportTransform(vpt);
      lastPos.current = { x: opt.e.clientX, y: opt.e.clientY };
    });

    canvas.on("mouse:up", (opt) => {
      if (opt.e.button === 1) {
        isMiddleMouseDown.current = false;
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    });

    canvas.on("mouse:wheel", (opt) => {
      const e = opt.e;

      // Standard-Browser-Verhalten unterbinden
      e.preventDefault();
      e.stopPropagation();

      // Auslesen der Delta-Werte
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;

      // Prüfen, ob SHIFT gedrückt ist (als Beispiel)
      if (e.shiftKey) {
        // ===> PANNING
        // Viewport-Transform holen
        const vpt = canvas.viewportTransform;
        if (!vpt) {
          return;
        }

        // Canvas entlang der X- und Y-Achse verschieben
        vpt[4] -= deltaX;
        vpt[5] -= deltaY;

        // Neue Viewport-Transformation anwenden
        canvas.setViewportTransform(vpt);
      } else {
        // ===> ZOOMEN
        let zoom = canvas.getZoom();

        // Faktor berechnen (z.B. exponentieller Zoom wie in deinem Code)
        zoom *= 0.999 ** deltaY;

        // Grenzen setzen
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;

        // Zoomen relativ zur aktuellen Mausposition
        const pointer = canvas.getPointer(opt.e);
        canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);
      }
    });

    fabricRef.current = canvas;
  }, [height, width]);

  function addTriangle() {
    if (!fabricRef.current) {
      return;
    }

    const triangle = new fabric.Triangle({
      left: 100,
      top: 50,
      fill: "blue",
      width: 200,
      height: 200,
      objectCaching: false,
      stroke: "black",
      strokeWidth: 2,
      angle: 45,
    });

    fabricRef.current.add(triangle);
    fabricRef.current.setActiveObject(triangle);
  }

  function addRect() {
    if (!fabricRef.current) {
      return;
    }

    const rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: "red",
      width: 200,
      height: 200,
      objectCaching: false,
      stroke: "black",
      strokeWidth: 2,
    });

    fabricRef.current.add(rect);
    fabricRef.current.setActiveObject(rect);
  }

  async function save() {
    if (!fabricRef.current) {
      return;
    }

    const data = fabricRef.current.toDatalessJSON();
    const newLayout = await saveLayout.mutateAsync({
      ...data,
      layoutId,
    });

    queryclient.invalidateQueries({ queryKey: ["layouts", orgId] });
    router.push(`/${orgId}/layouts/${newLayout.id}`);
  }

  function selectDisplay(display: Display) {
    setSelectedDisplay(display);
  }

  return (
    <div className="grid grid-cols-5 w-full h-full">
      <div className="flex flex-col h-full w-full col-span-4 border-t">
        <div className="border-b w-full px-4 py-2 flex flex-row gap-2 items-center">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={async () => await save()}
            disabled={saveLayout.isPending}
            loading={saveLayout.isPending}
          >
            <Save className="size-4" />
          </Button>
          <Link
            href={`/preview/${layoutId}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "ml-auto",
            )}
            title={t("preview")}
            target="_blank"
          >
            {t("preview")}
          </Link>
        </div>
        <div className="relative h-full w-full" ref={wrapperRef}>
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div className="col-span-1 bg-sidebar h-full border-l border-t">
        <Tabs defaultValue="elements" className="w-full">
          <TabsList className="w-full rounded-none bg-sidebar">
            <TabsTrigger value="elements">{t("elements")}</TabsTrigger>
            <TabsTrigger value="displays">{t("displays")}</TabsTrigger>
          </TabsList>
          <TabsContent value="elements" className="px-2 flex flex-col gap-1">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => addRect()}
              disabled={saveLayout.isPending}
              className="w-full"
            >
              <Square className="size-4" />
              {t("addRectangle")}
            </Button>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => addTriangle()}
              disabled={saveLayout.isPending}
              className="w-full"
            >
              <Triangle className="size-4" />
              {t("addTriangle")}
            </Button>
          </TabsContent>
          <TabsContent value="displays">
            <ul className="px-2">
              {displays.data?.map((display) => (
                <li key={display.id}>
                  <Button
                    type="button"
                    onClick={() => selectDisplay(display)}
                    className="w-full"
                  >
                    {display.name}
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
