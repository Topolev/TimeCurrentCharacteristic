import {Area} from "./area-template";

export class Characteristic{
  id:number;
  label: string;
  color: string;
  areas: Area[];
  visable: boolean;
  constructor(){
    this.color = "#000000"
    this.areas = [];
    this.visable = true;
  }
}
