import Stage from "./Stage";
import {StringArray} from "./BuilderStage";
import {ConfigCoordinatePanel} from "../ConfigCoordinatePanel";
import Point from "../Point";
import * as utilCanvas from "../util-canvas";
import {CurrentSlice} from "../CurrentSlice";

export default class IndependentStage extends Stage {

  variables: Array<StringArray>;
  fn: (x: number) => number;

  constructor() {
    super();
  }

  draw(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel): Point {
    let iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;

    let tsz = +this.variables['tsz'];
    let Isz = +this.variables['Isz'] * iBase;

    //let yTopWorkspace = (config.height - 2 * config.marginVertical) / config.scale - config.y0Offset;
    //var yTop = prevPointArea ? prevPointArea.y : yTopWorkspace;
    let yTop = (config.height - 2 * config.marginVertical) / config.scale - config.y0Offset;

    //var xRightWorkspace = (config.width - 2 * config.marginHorizontal) / config.scale - config.x0Offset;
    //var xRight = (area.xEnd != null && +area.xEnd < xRightWorkspace) ? +area.xEnd : xRightWorkspace;
    let xRight = (config.width - 2 * config.marginHorizontal) / config.scale - config.x0Offset;
    utilCanvas.drawLine(ctx,
      +Stage.xOriginToFact(Isz, config), Stage.yOriginToFact(yTop, config),
      +Stage.xOriginToFact(Isz, config), Stage.yOriginToFact(tsz, config), this.characteristic.color);

    utilCanvas.drawLine(ctx,
      +Stage.xOriginToFact(Isz, config), +Stage.yOriginToFact(tsz, config),
      +Stage.xOriginToFact(xRight, config), +Stage.yOriginToFact(tsz, config), this.characteristic.color);

    return new Point(+Stage.xOriginToFact(xRight, config), Stage.yOriginToFact(tsz, config));
  }

  drawHorizontalLine(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel, currentSlice: CurrentSlice) {
    var iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;
    var xOrigin = currentSlice.current;
    let yOrigin = +this.fn(xOrigin);
    if (xOrigin / iBase > +this.variables['Isz']) {
      Stage.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin, ctx, config);
    }
  }
}


/*
 *
 *   private drawHorizontalLineForIndependent(xFact: number, characteristic: Characteristic, area: Area) {
 var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;
 var xOrigin = this.xFactToOrigin(xFact);
 let yOrigin = +area.fn(xOrigin);
 if (xOrigin / iBase > +area.variables['Isz']) {
 this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
 }
 }*/


