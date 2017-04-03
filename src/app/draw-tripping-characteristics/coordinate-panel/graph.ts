import Point from "./point";
export default class Graph {
  //There are two type: 'POINTS' and 'EXPRESSION'
  public type: string;
  public points: Point[] = [];
  //Function is identify how calculate Y from X (Y = f(X))
  public expression: (x:number) => number;

  public addPoint(point: Point){
    this.points.push(point);
    return this;
  }

}
