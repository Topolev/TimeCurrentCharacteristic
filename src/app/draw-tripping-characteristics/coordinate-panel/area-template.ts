import Point from "./Point";
import {PointsTemplate} from "./PointsTemplate";
export const enum TYPE_AREA  {
  POINTS,
  EXPRESSION,
  INDEPENDENT
}

export interface StringArray {
  [index: number]: string;
}

export class Area {
  id:number;
  areaTemplate: AreaTemplate;
  pointsTemplate: PointsTemplate;

  xStart: number = 0;
  xEnd: number = 0;
  type: TYPE_AREA;
  label: string;

  //Make sense only for Expression and Independent
  variables?: Array<StringArray>;
  fn?: (x:number)=> number;

  //Make sense only for Point
  points?: Point[]

}


export class VariableDescription {
  labelForUser: string;
  label: string;
}

export class AreaTemplate {
  id: number;
  label: string;
  type: TYPE_AREA;

  //Make sense only for ExpressionArea
  variableDescriptions?: VariableDescription[];
  fn?: (x: number) => number;
}




export const defaultAreaTemplates: AreaTemplate[] = [
  {
    id: 0,
    label: "По точкам",
    type: TYPE_AREA.POINTS
  },
  {
    id: 1,
    label: "Независимая",
    type: TYPE_AREA.INDEPENDENT,
    variableDescriptions: [{
      label: "Isz",
      labelForUser: "Пусковой ток",
    }, {
      label: "tsz",
      labelForUser: "Время срабатывания",
    }],
    fn: function(x) {
      var tsz = this.variables['tsz'];
      return tsz;
    }
  },
  {
    id: 2,
    label: "Нормально-инверсная (IEC)",
    type: TYPE_AREA.EXPRESSION,
    variableDescriptions: [{
      label: "k",
      labelForUser: "Коэффициент k",
    }, {
      label: "Isz",
      labelForUser: "Пусковой ток",
    }],
    fn: function(x) {
      var k = this.variables['k'];
      var Isz = this.variables['Isz'];
      return k * 0.14 /(Math.pow(x/Isz,0.02)-1);
    }
  }
];






