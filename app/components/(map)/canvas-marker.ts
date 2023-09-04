import { ICON } from "@/app/lib/icons";
import leaflet from "leaflet";

leaflet.Canvas.include({
  updateCanvasImg(layer: CanvasMarker) {
    const { icon, name, isHighlighted, isDiscovered } = layer.options;

    let radius = layer.getRadius();
    if (isHighlighted) {
      radius += 5;
    }
    const imageSize = radius * 2;
    const p = layer._point.round();
    const dx = p.x - radius;
    const dy = p.y - radius;

    const layerContext = this._ctx as CanvasRenderingContext2D;

    layerContext.save();
    layerContext.globalAlpha = isDiscovered ? 0.4 : 1;

    if ("src" in icon && !("isText" in icon)) {
      layerContext.drawImage(layer.imageElement, dx, dy, imageSize, imageSize);
      layerContext.restore();
      return;
    }
    if (!("path" in icon)) {
      const text = name ?? "";
      layerContext.fillStyle = "#e6e5e3";
      layerContext.textAlign = "center";
      layerContext.strokeStyle = "#594f42";

      layerContext.font = "normal 700 14px Arial";

      const lineheight = 15;

      text.split(" ").forEach((line, i) => {
        layerContext.lineWidth = 3;
        layerContext.strokeText(line, p.x, p.y - imageSize + i * lineheight);
        layerContext.lineWidth = 1;
        layerContext.fillText(line, p.x, p.y - imageSize + i * lineheight);
      });
      layerContext.restore();

      return;
    }

    layerContext.lineWidth = icon.lineWidth - 1;
    layerContext.translate(dx, dy);

    const scale = imageSize / 100;
    layerContext.scale(scale, scale);

    if (isHighlighted) {
      layerContext.shadowBlur = 4;
      layerContext.shadowColor = "#999999";
    }

    layerContext.fillStyle = isDiscovered ? "#5f5d57" : icon.color;
    const path2D = new Path2D(icon.path);
    layerContext.fill(path2D);
    layerContext.strokeStyle = "black";
    layerContext.lineWidth = icon.lineWidth + 1;
    layerContext.stroke(path2D);
    layerContext.lineWidth = icon.lineWidth;
    layerContext.stroke(path2D);

    if (isDiscovered) {
      const checkMarkPath = new Path2D("m5 12 5 5L20 7");
      layerContext.scale(1.5, 1.5);
      layerContext.translate(radius * 1.7, radius * 0.3);
      layerContext.lineWidth = 5;
      layerContext.strokeStyle = "#000";
      layerContext.stroke(checkMarkPath);
      layerContext.strokeStyle = "#23ff80";
      layerContext.lineWidth = 4;
      layerContext.stroke(checkMarkPath);
    }
    layerContext.restore();
  },
});
const renderer = leaflet.canvas({ pane: "markerPane" }) as leaflet.Canvas & {
  updateCanvasImg: (layer: CanvasMarker) => void;
};

export type CanvasMarkerOptions = {
  id: string;
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
