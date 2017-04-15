import Point from "./Point";


export function clearCanvas(ctx: CanvasRenderingContext2D, width:number, height:number): void {
    ctx.clearRect(0, 0, width, height);
};

export function drawFillRectangle(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string): void {
    ctx.beginPath();
    ctx.rect(x1, y1, x2, y2);
    ctx.fillStyle = color;
    ctx.fill();
};

export function drawOutlineRectangle(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string): void {
    ctx.fillStyle = color;
    ctx.strokeRect(x1, y1, x2, y2);
};

export function drawOutlineRectangleByPoints(ctx: CanvasRenderingContext2D, point1: Point, point2: Point, color: string): void {
    drawOutlineRectangle(ctx, point1.x, point1.y, point2.x, point2.y, color);
};

export  function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, colorLine: string = "#000000") {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = colorLine;
    ctx.stroke();
}

export function  drawLineDash(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string = "red") {
  ctx.setLineDash([5, 3]);
  /*dashes are 5px and spaces are 3px*/
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([1, 0]);
}

export function renderTextAndFillBackground(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = "yellow") {
  var widthText = ctx.measureText(text).width;

  ctx.fillStyle = 'yellow';
  ctx.fillRect(x - 3, y + 5, widthText + 3, -20);
  ctx.fillStyle = 'blue';
  ctx.fillText(text, x, y);
}
