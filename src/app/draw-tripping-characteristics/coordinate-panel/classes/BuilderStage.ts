import {StageTemplate, TYPE_STAGE} from "./StageTemplate";
import Stage from "./Stage";
import PointsAbsStage from "./PointsAbsStage";
import {Characteristic} from "../characteristic/Characteristic";
import ExpressionStage from "./ExpressionStage";
import IndependentStage from "./IndependentStage";
import Point from "../Point";
import PointsRelativeStage from "./PointsRelativeStage";

export interface StringArray {
  [index: number]: string;
}





/*

{x:120,y:0.1},
{x:130,y:0.09},
{x:140,y:0.08},
{x:155,y:0.07},
{x:170,y:0.06},
{x:180, y:0.05},
{x:190,y:0.04},
{x:200,y:0.03},
{x:250,y:0.02},
{x:310,y:0.01},
{x:1000, y: 0.01}
*/

let  points: Array<Point> = [


  new Point(30, 5),
  new Point(45, 1.1),
  new Point(50, 1),
  new Point(55, 0.8),
  new Point(56, 0.7),
  new Point(59, 0.6),
  new Point(60, 0.5),
  new Point(90, 0.2)
];

export class BuilderStage {
  public buildStageByTemplate(stageTemplate: StageTemplate, characteristic: Characteristic): Stage {
    let stage: Stage;
    switch (stageTemplate.type) {
      case TYPE_STAGE.POINTS_ABS : {
        stage = new PointsAbsStage();


        (<PointsAbsStage> stage).points = [];
        break;
      }
      case TYPE_STAGE.POINTS_RELATIVE : {
        //Change
        stage = new PointsRelativeStage();
        (<PointsRelativeStage> stage).points = [];
        (<PointsRelativeStage> stage).baseValue = 1;
        break;
      }
      case TYPE_STAGE.EXPRESSION: {
        stage = new ExpressionStage();
        (<ExpressionStage> stage).fn = stageTemplate.fn;
        let variables: Array<StringArray> = [];
        if (stageTemplate.variableDescriptions) {
          for (let variable of stageTemplate.variableDescriptions) {
            variables[variable.label] = 1;
          }
        }
        (<ExpressionStage> stage).variables = variables;
        break;
      }
      case TYPE_STAGE.INDEPENDENT: {
        stage = new IndependentStage();
        (<IndependentStage> stage).fn = stageTemplate.fn;
        let variables: Array<StringArray> = [];
        if (stageTemplate.variableDescriptions) {
          for (let variable of stageTemplate.variableDescriptions) {
            variables[variable.label] = 3.9;
          }
        }
        (<IndependentStage> stage).variables = variables;
        break;

      }
    }

    stage.stageTemplate = stageTemplate;
    stage.characteristic = characteristic;
    return stage;
  }
}

