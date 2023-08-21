import { ICON } from "@/app/lib/icons";
import leaflet from "leaflet";

const cachedImages: Record<string, HTMLImageElement> = {};
leaflet.Canvas.include({
  updateCanvasImg(layer: CanvasMarker) {
    const { type, icon, name, isHighlighted, isDiscovered } = layer.options;

    let radius = layer.getRadius();
    if (isHighlighted) {
      radius += 5;
    }
    const imageSize = radius * 2;
    const p = layer._point.round();
    const dx = p.x - radius;
    const dy = p.y - radius;

    const layerContext = this._ctx as CanvasRenderingContext2D;
    if ("src" in icon) {
      layerContext.drawImage(layer.imageElement, dx, dy, imageSize, imageSize);
      return;
    } else if (!("path" in icon)) {
      const text = name ?? "";
      layerContext.fillStyle = "#e6e5e3";
      layerContext.textAlign = "center";
      layerContext.strokeStyle = "#594f42";

      layerContext.font = "normal 800 14px Arial";

      const lineheight = 15;

      text.split(" ").forEach((line, i) => {
        layerContext.lineWidth = 3;
        layerContext.strokeText(line, p.x, p.y - imageSize + i * lineheight);
        layerContext.lineWidth = 1;
        layerContext.fillText(line, p.x, p.y - imageSize + i * lineheight);
      });
      return;
    }
    const key = `${type}-${isHighlighted}-${radius}-${isDiscovered}`;
    if (cachedImages[key]) {
      layerContext.drawImage(cachedImages[key], dx, dy);
      return;
    }
    const img = new Image(imageSize, imageSize);
    cachedImages[key] = img;

    const canvas = document.createElement("canvas");
    canvas.width = imageSize;
    canvas.height = imageSize;
    const ctx = canvas.getContext("2d")!;
    ctx.globalAlpha = isDiscovered ? 0.5 : 1;

    ctx.lineWidth = icon.lineWidth;

    const scale = imageSize / 100;
    ctx.scale(scale, scale);

    if (isHighlighted) {
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#999999";
    }

    ctx.fillStyle = isDiscovered ? "#5f5d57" : icon.color;
    const path2D = new Path2D(icon.path);
    ctx.fill(path2D);
    ctx.strokeStyle = "black";
    ctx.lineWidth = icon.lineWidth + 1;
    ctx.stroke(path2D);
    ctx.lineWidth = icon.lineWidth;
    ctx.stroke(path2D);

    if (isDiscovered) {
      const checkMarkPath = new Path2D("m5 12 5 5L20 7");
      ctx.scale(1.5, 1.5);
      ctx.translate(radius * 1.7, radius * 0.3);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#000";
      ctx.stroke(checkMarkPath);
      ctx.strokeStyle = "#23ff80";
      ctx.lineWidth = 4;
      ctx.stroke(checkMarkPath);
    }

    img.src = ctx.canvas.toDataURL("image/webp");
    layerContext.drawImage(img, dx, dy);
  },
});
const renderer = leaflet.canvas({ pane: "markerPane" }) as leaflet.Canvas & {
  updateCanvasImg: (layer: CanvasMarker) => void;
};

export type CanvasMarkerOptions = {
  id: string;
  type: string;
  name?: string;
  isHighlighted?: boolean;
  isDiscovered?: boolean;
  icon: ICON;
};

const imageElements: {
  [src: string]: HTMLImageElement;
} = {};
class CanvasMarker extends leaflet.CircleMarker {
  declare options: leaflet.CircleMarkerOptions & CanvasMarkerOptions;
  private _renderer: typeof renderer;
  declare _point: leaflet.Point;
  declare imageElement: HTMLImageElement;
  private _onImageLoad: (() => void) | undefined = undefined;

  constructor(
    latLng: leaflet.LatLngExpression,
    options: leaflet.CircleMarkerOptions & CanvasMarkerOptions
  ) {
    options.renderer = renderer;
    super(latLng, options);
    this._renderer = renderer;

    if ("src" in options.icon) {
      if (!imageElements[options.icon.src]) {
        imageElements[options.icon.src] = document.createElement("img");
        imageElements[options.icon.src].src = options.icon.src;
      }
      this.imageElement = imageElements[options.icon.src];
    }
  }

  update() {
    if (this.options.isHighlighted) {
      this.bringToFront();
    }
    this.redraw();
  }

  _updatePath(): void {
    if (!this.imageElement || this.imageElement.complete) {
      this._renderer.updateCanvasImg(this);
    } else if (!this._onImageLoad) {
      this._onImageLoad = () => {
        this.imageElement.removeEventListener("load", this._onImageLoad!);
        this._renderer.updateCanvasImg(this);
      };
      this.imageElement.addEventListener("load", this._onImageLoad);
    }
  }
}

export default CanvasMarker;
