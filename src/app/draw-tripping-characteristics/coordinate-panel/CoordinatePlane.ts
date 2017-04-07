/**
 * Created by Vladimir on 22.03.2017.
 */
import Point from "./Point";
import * as utilCanvas from "./util-canvas";
import {Injectable} from "@angular/core";
import {ConfigCoordinatePanel, defaultConfig} from "./ConfigCoordinatePanel";
import {Area} from "./area-template";
import {Characteristic} from "./Characteristic";
import {CurrentSlice} from "./CurrentSlice";

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
  private currentSlices: Array<CurrentSlice> = [];


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

  public addCurrentSlices(currentSlices: Array<CurrentSlice>) {
    console.log(currentSlices);
    this.currentSlices = currentSlices;
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
    this.ctxBack.font = "14px Arial";

    var x0 = this.xOriginToFact(0);
    utilCanvas.drawLine(this.ctxBack, x0, 10, x0 + 2, 25);
    utilCanvas.drawLine(this.ctxBack, x0, 10, x0 - 2, 25);
    utilCanvas.drawLine(this.ctxBack, x0, 10, x0, this.height - this.config.marginVertical, '#000000');
    this.ctxBack.fillText("I, A", this.width - this.config.marginVertical + 15, this.height - this.config.marginVertical + 30);

    var y0 = this.yOriginToFact(0);
    utilCanvas.drawLine(this.ctxBack, this.config.marginHorizontal, y0, this.width - 5, y0, '#000000');
    utilCanvas.drawLine(this.ctxBack, this.width - 5, y0, this.width - 20, y0 - 2);
    utilCanvas.drawLine(this.ctxBack, this.width - 5, y0, this.width - 20, y0 + 2);
    this.ctxBack.fillText("t, c", 10, 25);
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
    var totalAxis = (this.height - 2 * this.config.marginVertical) / (this.config.scale * this.config.scaleYInit * this.config.yStepGrid);
    var intervalBetweenText = Math.ceil(totalAxis / this.config.maxNumberWithinY);

    var countAxisesBeforeY0 = (this.config.y0Offset / this.config.yStepGrid) | 0;
    var startY0 = this.height - (this.config.marginVertical + this.config.y0Offset * this.config.scale * this.config.scaleYInit - countAxisesBeforeY0 * this.config.yStepGrid * this.config.scale * this.config.scaleYInit);
    for (var y = startY0, i = 0; y > this.config.marginVertical; y -= this.config.yStepGrid * this.config.scale * this.config.scaleYInit, i++) {
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
      var xOrigin = this.xFactToOrigin(currentX);
      this.drawCurrentSlicesForCharacterisic([new CurrentSlice(+xOrigin.toFixed(2))]);
    }

  }

  private drawCurrentSlicesForCharacterisic(currentSlices: Array<CurrentSlice>) {
    console.log("drawCurrentSLices")

    //Draw horizonal slice
    for (let characteristic of this.characteristics) {
      if (characteristic.visable) {
        for (let area of characteristic.areas) {
          for (let currentSlice of currentSlices) {
            if (currentSlice.current) {
              var xFact = this.xOriginToFact(+currentSlice.current);
              this.drawHorizontalLineForArea(xFact, characteristic, area);
            }
          }
        }
      }
    }
    //Draw vertical slice
    currentSlices.filter(
      currentSlice => currentSlice.current
    ).map(currentSlice => {
      let xFact = this.xOriginToFact(+currentSlice.current);
      this.drawLineDash(this.ctxMain, xFact, this.config.marginVertical, xFact, this.height - this.config.marginVertical)
      this.renderTextAndFillBackground(this.ctxMain, currentSlice.current.toString(), xFact, 30);
    });
  }

  private drawHorizontalLineForArea(x: number, characterictic: Characteristic, area: Area) {
    switch (area.type) {
      case 0: {
        this.drawHorizonalLineForPoints(+x,characterictic, area);
        break;
      }
      case 1: {
        this.drawHorizonalLineForExpression(+x, characterictic, area);
        break;
      }
      case 2: {
        this.drawHorizontalLineForIndependent(+x, characterictic, area);
        break;
      }
    }
  }


  private drawHorizontalLineForIndependent(xFact: number,characteristic: Characteristic, area: Area) {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;
    var xOrigin = this.xFactToOrigin(xFact);
    let yOrigin = +area.fn(xOrigin);
    if (xOrigin/iBase > +area.variables['Isz']) {
      this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
    }
  }

  private drawHorizonalLineForPoints(xFact: number, characteristic: Characteristic, area: Area) {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;
    var xOrigin = this.xFactToOrigin(xFact);
    if ((+area.points[0].x < xOrigin/iBase) && (+area.points[area.points.length - 1].x > xOrigin/iBase)) {
      var prevPoint = area.points[0];
      var i = 0;
      while (prevPoint.x < xOrigin/iBase && i < area.points.length) {
        prevPoint = area.points[++i];
      }

      var fn = this.approximationByLine(area.points[i - 1], prevPoint);
      let yOrigin = fn(xOrigin/iBase);
      this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
    }
  }

  private drawHorizonalLineForExpression(xFact: number, characteristic: Characteristic, area: Area) {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;
    var xOrigin = this.xFactToOrigin(xFact);
    let yOrigin = area.fn(xOrigin/iBase);
    this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
  }

  /*Draw line which is coming via point (xOrigin, yOrigin)*/
  private drawHorizontalLineFromXOriginToEndWorkspace(xOrigin: number, yOrigin: number) {
    let yFact = this.yOriginToFact(yOrigin);
    let xFact = this.xOriginToFact(xOrigin);
    if (this.isYFactOnWorkspace(yFact)) {
      this.drawLineDash(this.ctxMain, xFact, yFact, this.width - this.config.marginHorizontal, yFact);
      this.renderTextAndFillBackground(this.ctxMain, (yOrigin.toFixed(2)).toString(), this.width - this.config.marginHorizontal + 5, yFact);
    }
  }



  private drawLineDash(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string = "red") {
    ctx.setLineDash([5, 3]);
    /*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([1, 0]);
  }


  approximationByLine(point1: Point, point2: Point): (x: number) => number {
    let x1 = +point1.x, y1 = +point1.y;
    let x2 = +point2.x, y2 = +point2.y;
    let k = (y2 - y1) / (x2 - x1);
    let b = (y1 * x2 - x1 * y2) / (x2 - x1);
    return (x) => k * x + b;
  }

  private renderTextAndFillBackground(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = "yellow") {
    var widthText = ctx.measureText(text).width;

    ctx.fillStyle = 'yellow';
    ctx.fillRect(x - 3, y + 5, widthText + 3, -20);
    ctx.fillStyle = 'blue';
    ctx.fillText(text, x, y);
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
            case 0: {
              lastPrevArea = this.drawPointsCharacteristic(characteristic, area, lastPrevArea, characteristic.color);
              break;
            }
            case 1: {
              lastPrevArea = this.drawExpressionCharacteristic(characteristic, area, lastPrevArea, characteristic.color);
              break;
            }
            case 2: {
              lastPrevArea = this.drawIndependentCharacteristic(characteristic, area, lastPrevArea, characteristic.color);
              break;
            }
          }
        }
      }
    }
    this.ctxMain.clearRect(0, 0, this.width, this.config.marginVertical);
    this.ctxMain.clearRect(0, this.height - this.config.marginVertical, this.width, this.config.marginVertical);


    //Create current slices
    this.drawCurrentSlicesForCharacterisic(this.currentSlices);

  }

  private calcXStartForArea(characteristic: Characteristic, area: Area): number {
    var uBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;

    return (!!!area.xStart && String(area.xStart).trim() != '' && area.xStart*uBase > -this.config.x0Offset) ? +area.xStart : -this.config.x0Offset;
  }

  private drawIndependentCharacteristic(characteristic: Characteristic, area: Area, prevPointArea: Point = null, color: string = '#000000'): Point {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;

    var tsz = +area.variables['tsz'];
    var Isz = +area.variables['Isz']*iBase;

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

  private drawExpressionCharacteristic(characteristic: Characteristic, area: Area, prevPointArea: Point = null, color: string = '#000000', step: number = 1): Point {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;

    var xPrev: number = this.calcXStartForArea(characteristic, area);
    var yPrev: number = +area.fn(xPrev);

    var xEndWorkspace = (this.width - 2 * this.config.marginHorizontal) / this.config.scale - this.config.x0Offset;
    var xEnd: number = (area.xEnd != null && area.xEnd < xEndWorkspace) ? area.xEnd : xEndWorkspace;
    for (let i = xPrev + step; i*iBase < xEnd; i += step) {
      utilCanvas.drawLine(this.ctxMain,
        +this.xOriginToFact(xPrev*iBase), this.yOriginToFact(yPrev),
        this.xOriginToFact((xPrev + step)*iBase), this.yOriginToFact(+area.fn(xPrev + step)), color);

      xPrev = xPrev + step;
      yPrev = +area.fn(xPrev);
    }
    return new Point(xPrev, yPrev);
  }

  private drawPointsCharacteristic(characteristic: Characteristic, area: Area, prevPointArea: Point = null, color: string = '#000000'): Point {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep/this.config.choosenVoltage : 1;

    var pointPrev = area.points[0];
    for (var i = 1; i < area.points.length; i++) {
      utilCanvas.drawLine(this.ctxMain,
        this.xOriginToFact(+pointPrev.x * iBase), this.yOriginToFact(+pointPrev.y),
        this.xOriginToFact(+area.points[i].x *iBase), this.yOriginToFact(+area.points[i].y), characteristic.color);
      pointPrev = area.points[i];
    }
    return pointPrev;
  }


  private convertFactYIntoOrigin(yFact: number) {

  }


  private xOriginToFact(xOrigin: number) {
    return this.config.marginHorizontal + (xOrigin + this.config.x0Offset) * this.config.scale * this.config.scaleXInit;
  }

  private yOriginToFact(yOrigin: number) {
    return this.height - this.config.marginVertical - (yOrigin + this.config.y0Offset) * this.config.scale * this.config.scaleYInit;
  }


  private xFactToOrigin(xFact: number) {
    return (xFact - this.config.marginHorizontal) / (this.config.scale * this.config.scaleXInit) - this.config.x0Offset;
  }

  private isYOriginOnWorkspace(yOrigin: number) {
    return true;
  }

  private isYFactOnWorkspace(yFact: number): boolean {
    return (yFact < (this.height - this.config.marginVertical)) && (yFact > this.config.marginVertical);
  }


}
