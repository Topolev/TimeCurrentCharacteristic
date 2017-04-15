import {ConfigCoordinatePanel} from "../ConfigCoordinatePanel";
import Point from "../Point";
import {StageTemplate} from "./StageTemplate";
import {Characteristic} from "../characteristic/Characteristic";
import {CurrentSlice} from "../CurrentSlice";
import * as utilCanvas from "../util-canvas";


export default class Stage{
  id:number;
  stageTemplate: StageTemplate;
  label: string;
  characteristic: Characteristic;

  draw (ctxMain: CanvasRenderingContext2D, config: ConfigCoordinatePanel):Point{
    console.log("This method will have to be overrided in class inheritor")
    return null;
  };

  drawHorizontalLine(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel, currentSlice: CurrentSlice){
    console.log("This method will have to be overrided in class inheritor");
  }

  static xOriginToFact(xOrigin: number, config: ConfigCoordinatePanel):number {
    return config.marginHorizontal + (xOrigin + config.x0Offset) * config.scale * config.scaleXInit;
  }
  static yOriginToFact(yOrigin: number, config: ConfigCoordinatePanel) {
    return config.height - config.marginVertical - (yOrigin + config.y0Offset) * config.scale * config.scaleYInit;
  }
  static xFactToOrigin(xFact: number, config: ConfigCoordinatePanel) {
    return (xFact - config.marginHorizontal) / (config.scale * config.scaleXInit) - config.x0Offset;
  }
  static isYFactOnWorkspace(yFact: number, config:ConfigCoordinatePanel): boolean {
    return (yFact < (config.height - config.marginVertical)) && (yFact > config.marginVertical);
  }

  /*Draw line which is coming via point (xOrigin, yOrigin)*/
  static drawHorizontalLineFromXOriginToEndWorkspace(xOrigin: number, yOrigin: number, ctx:CanvasRenderingContext2D, config: ConfigCoordinatePanel) {
    let yFact = Stage.yOriginToFact(yOrigin, config);
    let xFact = Stage.xOriginToFact(xOrigin, config);
    if (Stage.isYFactOnWorkspace(yFact, config)) {
      utilCanvas.drawLineDash(ctx, xFact, yFact, config.width - config.marginHorizontal, yFact);
      utilCanvas.renderTextAndFillBackground(ctx, (yOrigin.toFixed(2)).toString(), config.width - config.marginHorizontal + 5, yFact);
    }
  }
}

