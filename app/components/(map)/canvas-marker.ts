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
    } = layer.options;

    const radius = layer.getRadius();
    const imageSize = radius * 2;
    const p = layer._point.round();
    const dx = p.x - radius;
    const dy = p.y - radius;

    const layerContext = this._ctx as CanvasRenderingContext2D;
    layerContext.globalAlpha = 1;

    const isWaypoint = type === "waypoints";
    layerContext.globalAlpha = isDiscovered && !isWaypoint ? 0.5 : 1;

    const key = `${type}-${attribute}-${isHighlighted}-${radius}-${isDiscovered}`;
    if (cachedImages[key]) {
      if (cachedImages[key].complete) {
        layerContext.drawImage(cachedImages[key], dx, dy);
      } else {
        cachedImages[key].addEventListener("load", () => {
          layerContext.drawImage(cachedImages[key], dx, dy);
        });
      }
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imageSize;
    canvas.height = imageSize;
    const ctx = canvas.getContext("2d")!;

    const path2D = new Path2D(icon.path);
    ctx.strokeStyle = "strokeColor" in icon ? icon.strokeColor : "black";
    ctx.lineWidth = icon.lineWidth;
    ctx.fillStyle = isDiscovered && !isWaypoint ? "#5f5d57" : icon.color;

    const scale = imageSize / 100;
    ctx.scale(scale, scale);

    if (isHighlighted) {
      ctx.fillStyle = icon.heighlightColor;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#999999";
    }

    ctx.fill(path2D);
    ctx.stroke(path2D);

    if (isDiscovered && isWaypoint) {
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
    const img = new Image(imageSize, imageSize);
    img.src = ctx.canvas.toDataURL("image/webp");
    cachedImages[key] = img;
    img.addEventListener("load", () => {
      this._ctx.drawImage(img, dx, dy);
    });
  },
});
const renderer = leaflet.canvas({ pane: "markerPane" }) as leaflet.Canvas & {
  updateCanvasImg: (layer: CanvasMarker) => void;
};

export type CanvasMarkerOptions = {
  id: string;
  type: string;
  attribute?: string;
  aspect?: string;
  isHighlighted?: boolean;
  isDiscovered?: boolean;
  icon: ICON;
};

class CanvasMarker extends leaflet.CircleMarker {
  declare options: leaflet.CircleMarkerOptions & CanvasMarkerOptions;
  private _renderer: typeof renderer;
  declare _point: leaflet.Point;

  constructor(
    latLng: leaflet.LatLngExpression,
    options: leaflet.CircleMarkerOptions & CanvasMarkerOptions
  ) {
    options.renderer = renderer;
    super(latLng, options);
    this._renderer = renderer;
  }

  update() {
    // const highlightedRadius = this.options.icon.radius * 1.25;
    // if (this.options.isHighlighted && this.getRadius() !== highlightedRadius) {
    //   this.setRadius(highlightedRadius);
    // } else if (this.getRadius() !== this.options.icon.radius) {
    //   this.setRadius(this.options.icon.radius);
    // }

    this.redraw();
    if (this.options.isHighlighted) {
      this.bringToFront();
    }
  }

  _updatePath() {
    this._renderer.updateCanvasImg(this);
  }
}

export default CanvasMarker;
