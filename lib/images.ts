export function colorizeImage(src: string, rgb: [number, number, number]) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const gray =
          0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
        if (gray >= 180) {
          pixels[i] = rgb[0];
          pixels[i + 1] = rgb[1];
          pixels[i + 2] = rgb[2];
        }
      }
      context.putImageData(imageData, 0, 0);
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
    img.onerror = () => {
      resolve(src);
    };
    img.src = src;
  });
}
