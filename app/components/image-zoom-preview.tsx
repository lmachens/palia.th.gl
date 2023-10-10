"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

const ImageZoomPreview = ({ image }: { image: StaticImageData }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    setIsZoomed((prevZoom) => !prevZoom);
  };

  return (
    <div className={`relative ${isZoomed ? "z-50" : ""}`}>
      <Image
        alt="Image Preview"
        className={`cursor-pointer object-contain ${
          isZoomed ? "w-full h-full absolute inset-0" : "h-32"
        }`}
        onClick={toggleZoom}
        src={image.src}
        width={image.width}
        height={image.height}
      />
      {isZoomed && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-70"
          onClick={toggleZoom}
        >
          <Image
            alt="Zoomed Image"
            className="max-w-full max-h-full"
            {...image}
          />
        </div>
      )}
    </div>
  );
};

export default ImageZoomPreview;
