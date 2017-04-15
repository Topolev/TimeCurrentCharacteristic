/**
 * Created by Vladimir on 22.03.2017.
 */
import {Component, ElementRef, ViewChild, AfterViewInit} from "@angular/core";
import CoordinatePlane from "./coordinate-panel/CoordinatePlane";
import {ConfigCoordinatePanel, defaultConfig} from "./coordinate-panel/ConfigCoordinatePanel";
import {Characteristic} from "./coordinate-panel/characteristic/Characteristic";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicService} from "./modal/characteristic.service";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {BuilderStage} from "./coordinate-panel/classes/BuilderStage";
import Stage from "./coordinate-panel/classes/Stage";
import {defaultStageTemplates} from "./coordinate-panel/classes/StageTemplate";
import {CurrentSlice} from "./coordinate-panel/CurrentSlice";
import {defaultVoltageSteps} from "./coordinate-panel/VoltageSteps";
declare var spline:any;

@Component({
  selector: 'coordinate-plane',
  templateUrl: './coordinate-plane.component.html',
  styleUrls: ['./coordinate-plane.component.css']

})
export class CoordinatePlaneComponent implements AfterViewInit {
  grid: CoordinatePlane = null;
  characteristics: Characteristic[] = [];
  currentSlices: Array<CurrentSlice> = [];

  voltageSteps: Array<{value: number}> = defaultVoltageSteps;
  selectedVoltageStep: number;

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvasBack') canvasBack: ElementRef;

  config: ConfigCoordinatePanel;

  builderStage: BuilderStage;

  constructor(private modalService: NgbModal,
              private chactericticService: CharacteristicService) {


    this.config = Object.assign({},defaultConfig);
    this.builderStage = new BuilderStage();
    /*var characteristic = new Characteristic();
    var stage1: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[3], characteristic);
    var stage2: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[2], characteristic);
    var stage3: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[0], characteristic);
    var stage4: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[1], characteristic);

    characteristic.stages.push(stage1);
    characteristic.stages.push(stage2);
    characteristic.stages.push(stage3);
    characteristic.stages.push(stage4);

    this.characteristics.push(characteristic);*/

    this.chactericticService.newCharacteristic$.subscribe(
      characteristic => {
        this.setCharacteristic(characteristic);
      }
    )
  }

  ngAfterViewInit() {
    this.grid = new CoordinatePlane(this.canvas.nativeElement, this.canvasBack.nativeElement, this.config);
    this.grid.addCharacteristics(this.characteristics);
  }


  openModalCreateOrEditCharacteristic(characterisctic: Characteristic) {
    this.modalService.open(CharacteristicComponent, {windowClass: 'modal-create-new-graph'});
    this.chactericticService.setCurrentCharacteristic(characterisctic);
  }

  setCharacteristic(newCharacteristic: Characteristic){
    for (let characterisctic of this.characteristics){
      if (characterisctic.id === newCharacteristic.id){
        characterisctic = newCharacteristic;
        return;
      }
    }
    this.characteristics.push(newCharacteristic);
    this.grid.addCharacteristics(this.characteristics);
  }

  deleteCharacteristic(characteristic : Characteristic){
    this.characteristics.splice(this.characteristics.indexOf(characteristic),1);
  }

  changeVisable(characteristic: Characteristic){
    characteristic.visable = !characteristic.visable;
    this.grid.addCharacteristics(this.characteristics);
  }

  changeCurrentSlices(){
    this.grid.addCurrentSlices(this.currentSlices);
  }

  addCurrentSlice(){
    this.currentSlices.push(new CurrentSlice());
    this.changeCurrentSlices();
  }

  deleteCurrentSlice(currentSlice: CurrentSlice){
    this.currentSlices.splice(this.currentSlices.indexOf(currentSlice), 1);
    this.changeCurrentSlices();
  }

  changeConfig(){
    this.grid.updateConfigPanel();
  }


/*


  rerender() {
    this.grid.render(this.config);
  }











*/



}
