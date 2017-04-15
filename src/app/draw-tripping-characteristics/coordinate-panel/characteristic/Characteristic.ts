import Stage from "../classes/Stage";
import {PointsTemplate} from "../PointsTemplate";
/**
 * Created by Vladimir on 12.04.2017.
 */

export const enum TYPE_PROTECTION {
  FUSE,
  SWITCHER,
  CUSTOM
}

export class Characteristic{
  id:number;
  label: string;
  color: string;
  stages: Stage[];
  visable: boolean;
  // voltage where is placed protection (relay protection, automatic circuit breaker)
  voltageStep: number;
  // characteristic spread, spread is measured in %
  isSpread: boolean;
  spreadPlus: number;
  spreadMinus: number;
  typeProtection: TYPE_PROTECTION;
  pointsTemplate?: PointsTemplate;
  constructor(){
    this.color = "#000000"
    this.stages = [];
    this.visable = true;
    this.isSpread = false;
    this.typeProtection = null;
    this.pointsTemplate = null;
  }
}
