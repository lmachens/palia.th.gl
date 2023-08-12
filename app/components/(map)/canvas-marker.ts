import { ICON } from "@/app/lib/icons";
import leaflet from "leaflet";

const cachedImages: Record<string, HTMLImageElement> = {};
leaflet.Canvas.include({
  updateCanvasImg(layer: CanvasMarker) {
    const {
      type,
      icon,
      attribute = "",
      isHighlighted,
      isDiscovered,
      isAlternativeDiscoveredStyle,
    } = layer.options;

    let radius = layer.getRadius();
    if (isHighlighted) {
      radius += 5;
    }
    const imageSize = radius * 2;
    const p = layer._point.round();
    const dx = p.x - radius;
    const dy = p.y - radius;

    const layerContext = this._ctx as CanvasRenderingContext2D;
    const key = `${type}-${attribute}-${isHighlighted}-${radius}-${isDiscovered}-${isAlternativeDiscoveredStyle}`;
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
    ctx.globalAlpha = isDiscovered && !isAlternativeDiscoveredStyle ? 0.5 : 1;

    const path2D = new Path2D(icon.path);
    ctx.lineWidth = icon.lineWidth;

    const scale = imageSize / 100;
    ctx.scale(scale, scale);

    if (isHighlighted) {
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#999999";
    }

    ctx.fillStyle =
      isDiscovered && !isAlternativeDiscoveredStyle ? "#5f5d57" : icon.color;
    ctx.fill(path2D);
    ctx.strokeStyle = "black";
    ctx.lineWidth = icon.lineWidth + 1;
    ctx.stroke(path2D);
    ctx.strokeStyle = "strokeColor" in icon ? icon.strokeColor : "black";
    ctx.lineWidth = icon.lineWidth;
    ctx.stroke(path2D);

    if (isDiscovered && isAlternativeDiscoveredStyle) {
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

    if ("attribute" in icon && attribute) {
      const attributeColor = icon.attribute(attribute);
      if (attributeColor) {
        ctx.arc(75, 20, radius / 2, 0, Math.PI * 2, true);
        ctx.fillStyle = attributeColor;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
      }
    }
    img.src = ctx.canvas.toDataURL("image/webp");
    this._ctx.drawImage(img, dx, dy);
  },
});
const renderer = leaflet.canvas({ pane: "markerPane" }) as leaflet.Canvas & {
  updateCanvasImg: (layer: CanvasMarker) => void;
};

export type CanvasMarkerOptions = {
  id: string;
  type: string;
  attribute?: string;
  isHighlighted?: boolean;
  isDiscovered?: boolean;
  isAlternativeDiscoveredStyle?: boolean;
  icon: ICON;
};

class CanvasMarker extends leaflet.CircleMarker {
  declare options: leaflet.CircleMarkerOptions & CanvasMarkerOptions;
  private _renderer: typeof renderer;
  declare _point: leaflet.Point;

  constructor(
    latLng: leaflet.LatLngExpression,
    options: leaflet.CircleMarkerOptions & CanvasMarkerOptions,
  ) {
    options.renderer = renderer;
    super(latLng, options);
    this._renderer = renderer;
  }

  update() {
    if (this.options.isHighlighted) {
      this.bringToFront();
    }
    this.redraw();
  }

  _updatePath() {
    this._renderer.updateCanvasImg(this);
  }
}

export default CanvasMarker;
