"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { useMap } from "@/lib/storage/map";
import { useSettingsStore } from "@/lib/storage/settings";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";

export default function MapContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const {
    lockedWindow,
    mapTransform,
    setMapTransform,
    mapFilter,
    setMapFilter,
    windowOpacity,
    setWindowOpacity,
  } = useSettingsStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const moveableRef = useRef<Moveable>(null);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useEffect(() => {
    if (!isOverlay) {
      return;
    }
    moveableRef.current?.moveable.request(
      "draggable",
      { deltaX: 0, deltaY: 0 },
      true
    );

    const onResize = () => {
      // @ts-ignore
      moveableRef.current?.moveable.request(
        "draggable",
        { deltaX: 0, deltaY: 0 },
        true
      );
    };
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize, true);
    };
  }, []);

  if (!isOverlay) {
    return <div className={cn("h-dscreen pt-[50px]")}>{children}</div>;
  }
  return (
    <>
      <div
        ref={mapContainerRef}
        className={`absolute inset-0 top-[60px] m-2`}
        style={mapTransform}
      >
        {!lockedWindow && (
          <div className="absolute -top-6 right-0 flex w-fit rounded-t-lg bg-opacity-50 bg-neutral-800 ml-auto text-neutral-300">
            <Select value={mapFilter} onValueChange={setMapFilter}>
              <SelectTrigger className="h-full py-0.5 border-none focus:ring-0 w-auto">
                <SelectValue placeholder="Transparency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Transparency</SelectItem>
                <SelectItem value="greyscale">Greyscale</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
                <SelectItem value="full">Full Transparency</SelectItem>
              </SelectContent>
            </Select>
            <Slider
              className="w-24"
              value={[windowOpacity]}
              step={0.05}
              min={0.25}
              max={1}
              onValueChange={(value) => setWindowOpacity(value[0])}
            />
            <div ref={targetRef} className="cursor-move flex items-center p-1">
              <svg className="w-[16px] h-[16px]">
                <use xlinkHref="#icon-move" />
              </svg>
            </div>
            <div
              className="cursor-pointer flex items-center p-1"
              onClick={() => setIsEditMode((isEditMode) => !isEditMode)}
            >
              <svg className="w-[16px] h-[16px]">
                <use xlinkHref="#icon-resize" />
              </svg>
            </div>
          </div>
        )}
        <div
          className="h-full w-full"
          style={{
            willChange: "opacity",
            opacity: windowOpacity.toFixed(2),
          }}
        >
          {children}
        </div>
      </div>
      {!lockedWindow && (
        <Moveable
          ref={moveableRef}
          target={mapContainerRef}
          dragTarget={targetRef}
          draggable
          resizable={isEditMode}
          hideDefaultLines
          bounds={{ left: 0, top: 70, right: 0, bottom: 0, position: "css" }}
          snappable
          origin={false}
          onDrag={(e) => {
            e.target.style.cssText += e.cssText;
          }}
          onResize={(e) => {
            e.target.style.cssText += e.cssText;
          }}
          onRenderEnd={(e) => {
            setMapTransform({
              transform: e.target.style.transform,
              width: e.target.style.width,
              height: e.target.style.height,
            });
            map?.invalidateSize();
          }}
        />
      )}
    </>
  );
}
