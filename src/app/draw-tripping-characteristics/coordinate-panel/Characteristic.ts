import {Area} from "./area-template";

export class Characteristic{
  id:number;
  label: string;
  color: string;
  areas: Area[];
  visable: boolean;
  // voltage where is placed protection (relay protection, automatic circuit breaker)
  voltageStep: number;
  // characteristic spread, spread is measured in %
  isSpread: boolean;
  spreadPlus: number;
  spreadMinus: number;
  constructor(){
    this.color = "#000000"
    this.areas = [];
    this.visable = true;
    this.isSpread = false;
  }
}


