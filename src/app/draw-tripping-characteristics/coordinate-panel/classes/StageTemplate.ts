import {PointsTemplate} from "../PointsTemplate";
import {ConfigCoordinatePanel} from "../ConfigCoordinatePanel";
export const enum TYPE_STAGE  {
  POINTS_ABS,
  POINTS_RELATIVE,
  EXPRESSION,
  INDEPENDENT
}



export class VariableDescription {
  labelForUser: string;
  label: string;
}


export class StageTemplate {
  id: number;
  label: string;
  type: TYPE_STAGE;

  //Make sense only for ExpressionArea
  variableDescriptions?: VariableDescription[];
  fn?: (x: number) => number;
  displayExpression?: string;
}



export const defaultStageTemplates: StageTemplate[] = [
  {
    id: 0,
    label: "По точкам (абсолютные значение)",
    type: TYPE_STAGE.POINTS_ABS
  },
  {
    id: 1,
    label: "По точкам (относительные значение)",
    type: TYPE_STAGE.POINTS_RELATIVE
  },
  {
    id: 2,
    label: "Независимая",
    type: TYPE_STAGE.INDEPENDENT,
    variableDescriptions: [{
      label: "Isz",
      labelForUser: "Пусковой ток",
    }, {
      label: "tsz",
      labelForUser: "Время срабатывания",
    }],
    fn: function (x) {
      var tsz = this.variables['tsz'];
      return tsz;
    }
  },
  {
    id: 3,
    label: "IEC стандартно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени T",
    }, {
      label: "Is",
      labelForUser: "Уставка Is",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент C",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (0.14 / (Math.pow(I / Is, 0.02) - 1)) + C;
    },
    displayExpression: "t = T \\times \\frac{0.14}{\\left( \\frac{I}{I_s}\\right)^{0.02}-1} + C"
  } ,{
    id: 4,
    label: "IEC сильно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени T",
    }, {
      label: "Is",
      labelForUser: "Уставка ток Is",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент C",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (13.1 / (I / Is - 1)) + C;
    },
    displayExpression: "t = T \\times \\frac{13.1}{ \\frac{I}{I_s}-1} + C"
  },{
    id: 5,
    label: "IEC чрезвычайно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (80 / (Math.pow(I / Is, 2) - 1)) + C;
    },
    displayExpression: "t = T \\times \\frac{80}{\\left( \\frac{I}{I_s}\\right)^{2} - 1} + C"
  },
  {
    id: 6,
    label: "UK длительно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (120 / (I / Is - 1)) + C;
    },
    displayExpression: "t = T \\times \\frac{120}{ \\frac{I}{I_s} - 1} + C"
  },{
    id: 7,
    label: "UK для выпрямителя",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (45900 / (Math.pow(I / Is, 5.6) - 1)) + C;
    },
    displayExpression: "t = T \\times \\frac{45900}{ \\frac{I}{I_s}^{5.6} - 1} + C"
  },
  {
    id: 8,
    label: "IEEE умеренно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (0.0515 / (Math.pow(I / Is, 0.02) - 1) + 0.114) + C;
    },
    displayExpression: "t = T \\times \\left( \\frac{0.0515}{ \\frac{I}{I_s}^{0.02} - 1} +0.114 \\right) + C"
  },{
    id: 9,
    label: "IEEE сильно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (19.61 / (Math.pow(I / Is, 2) - 1) + 0.491) + C;
    },
    displayExpression: "t = T \\times \\left( \\frac{19.61}{ \\frac{I}{I_s}^{2} - 1} +0.491 \\right) + C"
  },{
    id: 10,
    label: "IEEE чрезвычайно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени T",
    }, {
      label: "Is",
      labelForUser: "Уставка Is",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент C",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (28.2 / (Math.pow(I / Is, 2) - 1) + 0.1217) + C;
    },
    displayExpression: "t = T \\times \\left( \\frac{28.2}{ \\frac{I}{I_s}^{2} - 1} + 0.1217 \\right) + C"
  },
  {
    id: 11,
    label: "US инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (5.95 / (Math.pow(I / Is, 2) - 1) + 0.18) + C;
    },
    displayExpression: "t = T \\times \\left( \\frac{5.95}{ \\frac{I}{I_s}^{2} - 1} + 0.18 \\right) + C"
  },{
    id: 12,
    label: "US кратковременно инверсная",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }, {
      label: "C",
      labelForUser: "Постоянный коэффициент",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      var C = this.variables['C'];
      return T * (0.16758 / (Math.pow(I / Is, 2) - 1) + 0.11858) + C;
    },
    displayExpression: "t = T \\times \\left( \\frac{0.16758}{ \\frac{I}{I_s}^{2} - 1} + 0.11858 \\right) + C"
  },
  {
    id: 13,
    label: "RI",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "K",
      labelForUser: "Коэффициент K",
    }, {
      label: "Is",
      labelForUser: "Уставка Is",
    }],
    fn: function (I) {
      var K = this.variables['K'];
      var Is = this.variables['Is'];
      return K * (1 / (0.339 - (0.236 * Is / I)));
    },
    displayExpression: "t = K \\times \\frac{1}{0.339 - 0.236 \\times \\frac{I_s}{I}} "
  },
  {
    id: 14,
    label: "Реле РТВ-I",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени T",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      return 1 / (30 * Math.pow(I / Is - 1, 3)) + T;
    },
    displayExpression: "t = \\frac{1}{30 \\times \\left( \\frac{I}{I_s} - 1 \\right)^{3}} + T "
  },
  {
    id: 15,
    label: "Реле РТВ-IV",
    type: TYPE_STAGE.EXPRESSION,
    variableDescriptions: [{
      label: "T",
      labelForUser: "Постоянная времени T",
    }, {
      label: "Is",
      labelForUser: "Уставка",
    }],
    fn: function (I) {
      var T = this.variables['T'];
      var Is = this.variables['Is'];
      return 1 / (20 * Math.pow((I / Is - 1) / 6, 1.8)) + T;
    },
    displayExpression: "t = \\frac{1}{20 \\times \\left( \\left( \\frac{I}{I_s} - 1 \\right)/6\\right)^{1.8}} + T "
  }
];














