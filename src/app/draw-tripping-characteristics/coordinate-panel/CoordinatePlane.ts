/**
 * Created by Vladimir on 22.03.2017.
 */
import Point from "./Point";
import * as utilCanvas from "./util-canvas";
import {Injectable} from "@angular/core";
import {ConfigCoordinatePanel, defaultConfig} from "./ConfigCoordinatePanel";
import {Area} from "./area-template";
import {CurrentSlice} from "./CurrentSlice";
import {Characteristic} from "./characteristic/Characteristic";

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
  private currentSlices: Array<CurrentSlice> = [] ;/*= [ new CurrentSlice(100,"test"), new CurrentSlice(200, "test"), new CurrentSlice(250, "test")];*/


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
    this.config.width =  canvasMain.offsetWidth;;
    this.config.height = canvasMain.offsetHeight;

    this.validateConfigData();

    this.ctxMain.font = "14px Arial";

    this.canvasMain.addEventListener("wheel", this.mouseWheel);
    this.canvasMain.addEventListener("mousemove", this.mouseOver);


    this.drawWorkspace();
  }

  private validateConfigData() {
   /* this.config.scale = this.config.scale || +this.config.scale <= 0 ? 1 : this.config.scale;
    this.config.xStepGrid = this.config.xStepGrid || +this.config.xStepGrid <=0 ? 20 :this.config.xStepGrid;
    this.config.yStepGrid = this.config.yStepGrid || +this.config.yStepGrid <=0 ? 0.1 :this.config.yStepGrid;*/
  }


  public addCharacteristic(characteristic: Characteristic) {
    this.characteristics.push(characteristic);
    this.render();
  }

  public addCurrentSlices(currentSlices: Array<CurrentSlice>) {
    this.currentSlices = currentSlices;
    this.render();
  }

  public addCharacteristics(characteristics: Characteristic[]) {
    this.characteristics = characteristics;
    this.render();
  }

  public updateConfigPanel() {
    let config = this.config;
    config.scale = +config.scale <= 0 ? defaultConfig.scale : config.scale;
    config.xStepGrid = +config.xStepGrid <=0 ? defaultConfig.xStepGrid : config.xStepGrid;
    config.yStepGrid = +config.yStepGrid <=0 ? defaultConfig.yStepGrid : config.yStepGrid;
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
        for (let stage of characteristic.stages) {
          for (let currentSlice of currentSlices) {
            if (currentSlice.current) {
              stage.drawHorizontalLine(this.ctxMain, this.config, currentSlice);
              //var xFact = this.xOriginToFact(+currentSlice.current);
              //this.drawHorizontalLineForArea(xFact, characteristic, area);
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
        this.drawHorizonalLineForPoints(+x, characterictic, area);
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


  //Exclude
  private drawHorizontalLineForIndependent(xFact: number, characteristic: Characteristic, area: Area) {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;
    var xOrigin = this.xFactToOrigin(xFact);
    let yOrigin = +area.fn(xOrigin);
    if (xOrigin / iBase > +area.variables['Isz']) {
      this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
    }
  }


  //Exclude
  private drawHorizonalLineForPoints(xFact: number, characteristic: Characteristic, area: Area) {
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
  }


  //Exclude
  private drawHorizonalLineForExpression(xFact: number, characteristic: Characteristic, area: Area) {
    var iBase = this.config.choosenVoltage ? characteristic.voltageStep / this.config.choosenVoltage : 1;
    var xOrigin = this.xFactToOrigin(xFact);
    let yOrigin = area.fn(xOrigin / iBase);
    this.drawHorizontalLineFromXOriginToEndWorkspace(xOrigin, yOrigin);
  }

  //Exclude
  private drawHorizontalLineFromXOriginToEndWorkspace(xOrigin: number, yOrigin: number) {
    let yFact = this.yOriginToFact(yOrigin);
    let xFact = this.xOriginToFact(xOrigin);
    if (this.isYFactOnWorkspace(yFact)) {
      this.drawLineDash(this.ctxMain, xFact, yFact, this.width - this.config.marginHorizontal, yFact);
      this.renderTextAndFillBackground(this.ctxMain, (yOrigin.toFixed(2)).toString(), this.width - this.config.marginHorizontal + 5, yFact);
    }
  }


  //Exclude
  private drawLineDash(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string = "red") {
    ctx.setLineDash([5, 3]);
    /*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([1, 0]);
  }


  //Exclude
  approximationByLine(point1: Point, point2: Point): (x: number) => number {
    let x1 = +point1.x, y1 = +point1.y;
    let x2 = +point2.x, y2 = +point2.y;
    let k = (y2 - y1) / (x2 - x1);
    let b = (y1 * x2 - x1 * y2) / (x2 - x1);
    return (x) => k * x + b;
  }


  //Exclude
  private renderTextAndFillBackground(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = "yellow") {
    var widthText = ctx.measureText(text).width;

    ctx.fillStyle = 'yellow';
    ctx.fillRect(x - 3, y + 5, widthText + 3, -20);
    ctx.fillStyle = 'blue';
    ctx.fillText(text, x, y);
  }

  public render(config: ConfigCoordinatePanel = this.config) {
    this.config = config;
    this.validateConfigData();
    this.clearWorkspace(this.ctxMain);
    this.drawAxises();

    for (let characteristic of this.characteristics){
      if (characteristic.visable){
        var lastPrevArea: Point = null;
        for (let stage of characteristic.stages){
          stage.draw(this.ctxMain, this.config);
        }
      }
    }
    this.ctxMain.clearRect(0, 0, this.width, this.config.marginVertical);
    this.ctxMain.clearRect(0, this.height - this.config.marginVertical, this.width, this.config.marginVertical);


    //Create current slices
    this.drawCurrentSlicesForCharacterisic(this.currentSlices);

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
