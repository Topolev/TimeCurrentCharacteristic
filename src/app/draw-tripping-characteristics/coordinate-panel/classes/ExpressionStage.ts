import Stage from "./Stage";
import {ConfigCoordinatePanel} from "../ConfigCoordinatePanel";
import Point from "../Point";
import * as utilCanvas from "../util-canvas";
import {StringArray} from "./BuilderStage";
import {Characteristic} from "../characteristic/Characteristic";
import {CurrentSlice} from "../CurrentSlice";



export default class ExpressionStage extends Stage{

  variables: Array<StringArray>;
  fn: (x:number)=> number;

  constructor(){
    super();
  }

  draw(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel):Point{
    let step = 1;
    let iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;

    //var xPrev: number = this.calcXStartForArea(characteristic, area);
    let xPrev: number = -config.x0Offset;
    let yPrev: number = +this.fn(xPrev);

    //let xEndWorkspace: number = (config.width - 2 * config.marginHorizontal) / config.scale - config.x0Offset;
    let xEnd: number =  (config.width - 2 * config.marginHorizontal) / config.scale - config.x0Offset;
    for (let i = xPrev + step; i * iBase < xEnd; i += step) {
      utilCanvas.drawLine(ctx,
        +Stage.xOriginToFact(xPrev * iBase, config), Stage.yOriginToFact(yPrev, config),
        Stage.xOriginToFact((xPrev + step) * iBase, config), Stage.yOriginToFact(+this.fn(xPrev + step), config), this.characteristic.color);

      xPrev = xPrev + step;
      yPrev = +this.fn(xPrev);
    }
    return new Point(xPrev, yPrev);
  }

  drawHorizontalLine(ctx: CanvasRenderingContext2D, config: ConfigCoordinatePanel, currentSlice: CurrentSlice){
    let iBase = config.choosenVoltage ? this.characteristic.voltageStep / config.choosenVoltage : 1;
    var xOrigin = +currentSlice.current;
    let yOrigin = this.fn(xOrigin / iBase);
    Stage.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin, ctx, config);
  }

  /*private calcXStartForArea(characteristic: Characteristic, stage: Stage, config: ConfigCoordinatePanel): number {
    var uBase = config.choosenVoltage ? characteristic.voltageStep / config.choosenVoltage : 1;

    return (!!!area.xStart && String(area.xStart).trim() != '' && area.xStart * uBase > -this.config.x0Offset) ? +area.xStart : -this.config.x0Offset;
  }*/

}




/*private drawExpressionCharacteristic(characteristic: Characteristic, area: Area, prevPointArea: Point = null, color: string = '#000000', step: number = 1): Point {
  var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;

  var xPrev: number = this.calcXStartForArea(characteristic, area);
  var yPrev: number = +area.fn(xPrev);

  var xEndWorkspace = (this.width - 2 * this.config.marginHorizontal) / this.config.scale - this.config.x0Offset;
  var xEnd: number = (area.xEnd != null && area.xEnd < xEndWorkspace) ? area.xEnd : xEndWorkspace;
  for (let i = xPrev + step; i * iBase < xEnd; i += step) {
    utilCanvas.drawLine(this.ctxMain,
      +this.xOriginToFact(xPrev * iBase), this.yOriginToFact(yPrev),
      this.xOriginToFact((xPrev + step) * iBase), this.yOriginToFact(+area.fn(xPrev + step)), color);

    xPrev = xPrev + step;
    yPrev = +area.fn(xPrev);
  }
  return new Point(xPrev, yPrev);
}*/

/*private drawHorizonalLineForExpression(xFact: number, characteristic: Characteristic, area: Area) {
  var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;
  var xOrigin = this.xFactToOrigin(xFact);
  let yOrigin = area.fn(xOrigin / iBase);
  this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
}*/
