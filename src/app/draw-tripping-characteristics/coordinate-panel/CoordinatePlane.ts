/**
 * Created by Vladimir on 22.03.2017.
 */
import Point from "./point";
import * as utilCanvas from "./util-canvas";
import {Injectable} from "@angular/core";
import {ConfigCoordinatePanel, defaultConfig} from "./ConfigCoordinatePanel";
import {Area} from "./area-template";
import {Characteristic} from "./Characteristic";

@Injectable()
export default class CoordinatePlane {

  ctxMain: CanvasRenderingContext2D;
  ctxBack: CanvasRenderingContext2D;
  canvasMain: HTMLCanvasElement;
  canvasBack: HTMLCanvasElement;

  private config: ConfigCoordinatePanel;


  private maxScale: number = 5;
  private minScale: number = 0.2;

  private prevMouseDown: boolean = false;
  private xMouseOverPrev: number;
  private yMouseOverPrev: number;

  private width: number;
  private height: number;

  private characteristics: Array<Characteristic> = [];


  /**
   *
   * xOrigin; yOrigin - original coordinate on panel excluding scale, margins
   * xFact; yFact - coordinates with considering scale, margints
   * ConfigCoorfinatePanel
   * x0Offset  - point's distance with coordinates (0,0) relatively left border of workspace
   * y0Offset  - point's distance with coordinates (0,0) relatively top border of workspace
   * xStepGrid - step between intermediate axises within X-axis
   * yStepGrid - step between intermediate axises within Y-axis
   * */
  constructor(canvasMain: HTMLCanvasElement, canvasBack: HTMLCanvasElement, config: ConfigCoordinatePanel = defaultConfig) {
    //create the workfield
    this.canvasMain = canvasMain;
    this.canvasBack = canvasBack;
    this.ctxMain = canvasMain.getContext("2d");
    this.ctxBack = canvasBack.getContext("2d");
    this.width = canvasMain.offsetWidth;
    this.height = canvasMain.offsetHeight;

    this.config = config;

    this.ctxMain.font = "14px Arial";

    this.canvasMain.addEventListener("wheel", this.mouseWheel);
    this.canvasMain.addEventListener("mousemove", this.mouseOver);
    //this.canvasMain.addEventListener("mousedown", this.mouseDown);
    //this.canvasMain.addEventListener("mouseup", this.mouseUp);

    this.drawWorkspace();
  }


  public addCharacteristic(characteristic: Characteristic) {
    this.characteristics.push(characteristic);
    this.render();
  }

  public addCharacteristics(characteristics: Characteristic[]) {
    this.characteristics = characteristics;
    this.render();
  }

  public updateAllCharacteristic(characteristics: Characteristic[]) {
    this.characteristics = characteristics;
    this.render();
  }


  private drawWorkspace() {
    this.clearWorkspace(this.ctxMain);
    this.drawAxises();
    //this.render();
    //this.drawBorderWorkspace();
  }

  private clearWorkspace(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
  }


  private drawVerticalLine(ctx: CanvasRenderingContext2D, x: number, color: string = "#000000") {
    utilCanvas.drawLine(ctx, x, this.config.marginVertical, x, this.height - this.config.marginVertical, color);
  }

  private drawHorizontalLine(ctx: CanvasRenderingContext2D, y: number, color: string = "#000000") {
    utilCanvas.drawLine(ctx, this.config.marginHorizontal, y, this.width - this.config.marginHorizontal, y, color);
  }

  private drawAxises() {
    this.clearWorkspace(this.ctxBack);
    this.drawMainAxises();
    this.drawIntermidiateXAxises();
    this.drawItermidiateYAxises();
  }

  private drawMainAxises() {
    this.drawVerticalLine(this.ctxBack, this.xOriginToFact(0), this.config.colorMainAxis);
    this.drawHorizontalLine(this.ctxBack, this.yOriginToFact(0), this.config.colorMainAxis);
  }

  private drawIntermidiateXAxises() {
    this.ctxBack.font = "14px Arial";

    var totalAxis = (this.width - 2 * this.config.marginHorizontal) / (this.config.scale * this.config.xStepGrid);
    var intervalBetweenText = Math.ceil(totalAxis / this.config.maxNumberWithinX);

    var countAxisesBeforeX0 = this.config.x0Offset / this.config.xStepGrid | 0;
    var startX0Fact = this.xOriginToFact(0) - countAxisesBeforeX0 * this.config.xStepGrid * this.config.scale;

    for (var x = startX0Fact, i = 0; x < this.width - this.config.marginHorizontal; x += this.config.xStepGrid * this.config.scale, i++) {
      this.drawVerticalLine(this.ctxBack, x, this.config.colorIntermediateAxis);
      if (i % intervalBetweenText == 0) {
        var text = (-(countAxisesBeforeX0--) * this.config.xStepGrid).toString();
        var widthText = this.ctxBack.measureText(text).width;
        this.ctxBack.fillText(text, x - widthText / 2, this.height - this.config.marginVertical + 30);
      } else {
        countAxisesBeforeX0--;
      }
    }
  }

  private drawItermidiateYAxises() {
    var totalAxis = (this.height - 2 * this.config.marginVertical) / (this.config.scale * this.config.scaleYInit* this.config.yStepGrid);
    var intervalBetweenText = Math.ceil(totalAxis / this.config.maxNumberWithinY);

    var countAxisesBeforeY0 = (this.config.y0Offset  / this.config.yStepGrid) | 0;
    var startY0 = this.height - (this.config.marginVertical + this.config.y0Offset * this.config.scale*this.config.scaleYInit - countAxisesBeforeY0 * this.config.yStepGrid * this.config.scale*this.config.scaleYInit);
    for (var y = startY0, i = 0; y > this.config.marginVertical; y -= this.config.yStepGrid * this.config.scale*this.config.scaleYInit, i++) {
      this.drawHorizontalLine(this.ctxBack, y, this.config.colorIntermediateAxis);
      if (i % intervalBetweenText == 0) {
        var text = (-(countAxisesBeforeY0--) * this.config.yStepGrid).toFixed(2).toString();
        this.ctxBack.fillText(text, 10, y + 6);
      } else {
        countAxisesBeforeY0--;
      }
    }
  }


  private mouseWheel = (e: MouseWheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    var delta = e.deltaY || e.detail || e.wheelDelta;
    if (delta < 0 && this.config.scale < this.maxScale) this.config.scale = +(this.config.scale + 0.1).toFixed(1);
    if (delta > 0 && this.config.scale > this.minScale) this.config.scale = +(this.config.scale - 0.1).toFixed(1);
    this.render();
  }

  public mouseDown = (ev: MouseEvent) => {
    this.xMouseOverPrev = ev.pageX - this.canvasMain.offsetLeft;
    this.yMouseOverPrev = ev.pageY - this.canvasMain.offsetTop;
    this.prevMouseDown = true;
  }

  public mouseUp = (ev: MouseEvent) => {
    this.prevMouseDown = false;
  }

  public mouseOver = (ev: MouseEvent) => {
    var currentX = ev.offsetX;

    this.render();

    if ((currentX > this.config.marginHorizontal) && (currentX < (this.width - this.config.marginHorizontal))) {
      this.drawVerticalLine(this.ctxMain, currentX, "red");
      this.renderTextAndFillBackground(this.ctxMain, (this.convertFactXIntoOrigin(currentX) / 1 | 0).toString(), currentX, this.height - 20);
      this.drawHorizontalLineForExpressionGraph(currentX);
    }

  }

  private drawHorizontalLineForExpressionGraph(x: number) {
    var xOrigin = this.convertFactXIntoOrigin(x);
    for (let characteristic of this.characteristics) {
      if (characteristic.visable) {

        for (let area of characteristic.areas) {
          switch (area.type) {
            case 1: {
              let yOrigin = area.fn(xOrigin);
              let yFact =  this.yOriginToFact(yOrigin);
              console.log("1",yOrigin,yFact);
              this.drawHorizontalLine(this.ctxMain, yFact, "red");
              this.renderTextAndFillBackground(this.ctxMain, (yOrigin.toFixed(2)).toString(), 10, yFact);
              break;
            }
            case 2: {
              let yOrigin = +area.fn(xOrigin);
              let yFact =  this.yOriginToFact(yOrigin);
              if (xOrigin > +area.variables['Isz']){
                this.drawHorizontalLine(this.ctxMain, yFact, "red");
                this.renderTextAndFillBackground(this.ctxMain, (yOrigin.toFixed(2)).toString(), 10, yFact);
              }
              break;
            }
          }
        }
      }
    }

    /*var i = 0;
    for (let graph of this.graphs) {
      if (graph.type == 'EXPRESSION') {
        let xOrigin = this.convertFactXIntoOrigin(x);
        let yOrigin = graph.expression(xOrigin);
        let yFact = this.yOriginToFact(yOrigin);
        console.log(i++, xOrigin, yOrigin);
        this.drawHorizontalLine(this.ctxMain, yFact, "red")
        this.renderTextAndFillBackground(this.ctxMain, (yOrigin / 1 | 0).toString(), 10, yFact);
        this.renderTextAndFillBackground(this.ctxMain, (xOrigin / 1 | 0).toString(), x, this.height - 35);
      }
    }*/
  }

  private renderTextAndFillBackground(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = "yellow") {
    var widthText = ctx.measureText(text).width;

    ctx.fillStyle = 'yellow';
    ctx.fillRect(x - 3, y + 5, widthText + 3, -20);
    ctx.fillStyle = 'blue';
    ctx.fillText(text, x, y);
    console.log("render:", text)
  }

  public render(config: ConfigCoordinatePanel = this.config) {
    this.config = config;
    this.clearWorkspace(this.ctxMain);
    this.drawAxises();

    for (let characteristic of this.characteristics) {
      if (characteristic.visable) {
        var lastPrevArea: Point = null;
        for (let area of characteristic.areas) {
          switch (area.type) {
            case 1: {
              lastPrevArea = this.drawExpressionCharacteristic(area, lastPrevArea, characteristic.color);
              break;
            }
            case 2: {
              lastPrevArea = this.drawIndependentCharacteristic(area, lastPrevArea, characteristic.color);
              break;
            }
          }
        }
      }
    }
    this.ctxMain.clearRect(0, 0, this.width, this.config.marginVertical);
    this.ctxMain.clearRect(0, this.height - this.config.marginVertical, this.width, this.config.marginVertical);

  }

  private calcXStartForArea(area: Area): number {
    return (!!!area.xStart && String(area.xStart).trim() != '' && area.xStart > -this.config.x0Offset) ? +area.xStart : -this.config.x0Offset;
  }

  private drawIndependentCharacteristic(area: Area, prevPointArea: Point = null, color: string = '#000000'): Point {
    var tsz = +area.variables['tsz'];
    var Isz = +area.variables['Isz'];

    var yTopWorkspace = (this.height - 2 * this.config.marginVertical) / this.config.scale - this.config.y0Offset;
    var yTop = prevPointArea ? prevPointArea.y : yTopWorkspace;


    var xRightWorkspace = (this.width - 2 * this.config.marginHorizontal) / this.config.scale - this.config.x0Offset;
    var xRight = (area.xEnd != null && +area.xEnd < xRightWorkspace) ? +area.xEnd : xRightWorkspace;

    utilCanvas.drawLine(this.ctxMain,
      +this.xOriginToFact(Isz), this.yOriginToFact(yTop),
      +this.xOriginToFact(Isz), this.yOriginToFact(tsz), color);

    utilCanvas.drawLine(this.ctxMain,
      +this.xOriginToFact(Isz), +this.yOriginToFact(tsz),
      +this.xOriginToFact(xRight), +this.yOriginToFact(tsz), color);

    return new Point(+this.xOriginToFact(xRight), this.yOriginToFact(tsz))
  }

  private drawExpressionCharacteristic(area: Area, prevPointArea: Point = null, color: string = '#000000', step: number = 1): Point {

    var xPrev: number = this.calcXStartForArea(area);
    var yPrev: number = +area.fn(xPrev);

    var xEndWorkspace = (this.width - 2 * this.config.marginHorizontal) / this.config.scale - this.config.x0Offset;
    var xEnd: number = (area.xEnd != null && area.xEnd < xEndWorkspace) ? area.xEnd : xEndWorkspace;
    for (let i = xPrev + step; i < xEnd; i += step) {
      utilCanvas.drawLine(this.ctxMain,
        +this.xOriginToFact(xPrev), this.yOriginToFact(yPrev),
        this.xOriginToFact(xPrev + step), this.yOriginToFact(+area.fn(xPrev + step)), color);
      xPrev = xPrev + step;
      yPrev = +area.fn(xPrev);
    }
    return new Point(xPrev, yPrev);
  }

  private drawExpressionGraph(func: (x: number) => number, step: number = 1) {
    var xPrev: number = -this.config.x0Offset;
    var yPrev: number = func(xPrev);
    var xEnd = (this.width - 2 * this.config.marginHorizontal) / this.config.scale - this.config.x0Offset;
    for (let i = xPrev + step; i < xEnd; i += step) {
      utilCanvas.drawLine(this.ctxMain,
        this.xOriginToFact(xPrev), this.yOriginToFact(yPrev),
        this.xOriginToFact(xPrev + step), this.yOriginToFact(func(xPrev + step)));
      xPrev = xPrev + step;
      yPrev = func(xPrev);
    }
  }


  private convertFactYIntoOrigin(yFact: number) {

  }


  private xOriginToFact(xOrigin: number) {
    return this.config.marginHorizontal + (xOrigin + this.config.x0Offset) * this.config.scale*this.config.scaleXInit;
  }

  private yOriginToFact(yOrigin: number) {
    return this.height - this.config.marginVertical - (yOrigin + this.config.y0Offset) * this.config.scale*this.config.scaleYInit;
  }


  private convertFactXIntoOrigin(xFact: number) {
    return (xFact - this.config.marginHorizontal) / (this.config.scale*this.config.scaleXInit) - this.config.x0Offset;
  }

  private isYOnWorkspace(yOrigin: number) {
    return true;
  }


}