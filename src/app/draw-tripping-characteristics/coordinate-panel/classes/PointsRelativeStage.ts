import Stage from "./Stage";
import {ConfigCoordinatePanel} from "../ConfigCoordinatePanel";
import Point from "../Point";
import * as utilCanvas from "../util-canvas";
import {CurrentSlice} from "../CurrentSlice";
import PointsStage from "./PointsStage";


export default class PointsRelativeStage extends PointsStage {

  baseValue: number;

  constructor() {
    super();
  }

  draw(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel): Point {
    var iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;

    var pointPrev = this.points[0];
    for (var i = 1; i < this.points.length; i++) {
      utilCanvas.drawLine(ctx,
        Stage.xOriginToFact(+pointPrev.x * iBase * this.baseValue, config), Stage.yOriginToFact(+pointPrev.y, config),
        Stage.xOriginToFact(+this.points[i].x * iBase * this.baseValue, config), Stage.yOriginToFact(+this.points[i].y, config), this.characteristic.color);
      pointPrev = this.points[i];
    }
    return pointPrev;
  }

  drawHorizontalLine(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel, currentSlice: CurrentSlice) {
    var iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;
    var xOrigin = +currentSlice.current;
    if ((+this.points[0].x < xOrigin / (iBase*this.baseValue)) && (+this.points[this.points.length - 1].x > xOrigin / (iBase*this.baseValue))) {
      var prevPoint = this.points[0];
      var i = 0;
      while (prevPoint.x < xOrigin / (iBase*this.baseValue) && i < this.points.length) {
        prevPoint = this.points[++i];
      }

      var fn = this.approximationByLine(this.points[i - 1], prevPoint);
      let yOrigin = fn(xOrigin / (iBase*this.baseValue));
      Stage.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin, ctx, config);
    }
  }

  private approximationByLine(point1: Point, point2: Point): (x: number) => number {
    let x1 = +point1.x, y1 = +point1.y;
    let x2 = +point2.x, y2 = +point2.y;
    let k = (y2 - y1) / (x2 - x1);
    let b = (y1 * x2 - x1 * y2) / (x2 - x1);
    return (x) => k * x + b;
  }

}

/*private drawHorizonalLineForPoints(xFact: number, characteristic: Characteristic, area: Area) {
 var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;
 var xOrigin = this.xFactToOrigin(xFact);
 if ((+area.points[0].x < xOrigin / iBase) && (+area.points[area.points.length - 1].x > xOrigin / iBase)) {
 var prevPoint = area.points[0];
 var i = 0;
 while (prevPoint.x < xOrigin / iBase && i < area.points.length) {
 prevPoint = area.points[++i];
 }

 var fn = this.approximationByLine(area.points[i - 1], prevPoint);
 let yOrigin = fn(xOrigin / iBase);
 this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
 }
 }*/


