import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Characteristic} from "../coordinate-panel/characteristic/Characteristic";


@Injectable()
export class CharacteristicService{

  private currentCharacteristic = new Subject<Characteristic>();
  private newCharacteristic = new Subject<Characteristic>();

  currentCharacteristic$ = this.currentCharacteristic.asObservable();
  newCharacteristic$ = this.newCharacteristic.asObservable();

  setCurrentCharacteristic(characteristic: Characteristic){
    this.currentCharacteristic.next(characteristic);
  }

  setNewCharacteristic(characteristic: Characteristic){
    this.newCharacteristic.next(characteristic);
  }


}
