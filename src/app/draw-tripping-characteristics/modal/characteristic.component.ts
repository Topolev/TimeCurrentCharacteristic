import {Component, ViewChild, ElementRef, AfterViewInit, OnInit} from "@angular/core";
import {NgbModal, NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import CoordinatePlane from "../coordinate-panel/CoordinatePlane";
import {ConfigCoordinatePanel} from "../coordinate-panel/ConfigCoordinatePanel";
import {CharacteristicService} from "./characteristic.service";
import {defaultVoltageSteps} from "../coordinate-panel/VoltageSteps";
import {Characteristic, TYPE_PROTECTION} from "../coordinate-panel/characteristic/Characteristic";
import {
  PointsTemplate,
  defaultFusePointTemplates,
  defaultSwitcherPointTemplates
} from "../coordinate-panel/PointsTemplate";
import Point from "../coordinate-panel/Point";
import Stage from "../coordinate-panel/classes/Stage";
import {BuilderStage} from "../coordinate-panel/classes/BuilderStage";
import {defaultStageTemplates} from "../coordinate-panel/classes/StageTemplate";
import PointsAbsStage from "../coordinate-panel/classes/PointsAbsStage";
import PointsRelativeStage from "../coordinate-panel/classes/PointsRelativeStage";
declare var jQuery: any;



@Component({
  selector: 'ngbd-modal-basic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.css']
})
export class CharacteristicComponent implements AfterViewInit, OnInit {
  ngOnInit(): void {
  }

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvasBack') canvasBack: ElementRef;
  @ViewChild("contentModal") contentModal: ElementRef;

  characteristic: Characteristic = new Characteristic();
  idCharacteristic: number;
  grid: CoordinatePlane = null;
  config: ConfigCoordinatePanel;
  isEditMode: boolean;
  voltageSteps: Array<{value: number}> = defaultVoltageSteps;

  typeProtection: TYPE_PROTECTION;
  // Default characteristics for fuse which is assigned as PointAbsStage



  constructor(private modalService: NgbModal,
              private activeModal: NgbActiveModal,
              private characteristicService: CharacteristicService) {
    characteristicService.currentCharacteristic$.subscribe(
      characteristic => {
        this.characteristic = characteristic ? characteristic : new Characteristic();
        this.idCharacteristic = characteristic ? characteristic.id : Date.now();
        this.characteristic.voltageStep = characteristic ? characteristic.voltageStep : this.voltageSteps[0].value;
      }
    )
  }

  openModal() {
    this.modalService.open(this.contentModal).result.then(() => {
    });
  }
  closeModal() {
    this.activeModal.close();
  }

  saveCharacteristic() {
    this.characteristic.id = this.idCharacteristic;
    this.characteristicService.setNewCharacteristic(this.characteristic);
    this.activeModal.close();
  }

  ngAfterViewInit(): void {
    this.grid = new CoordinatePlane(this.canvas.nativeElement, this.canvasBack.nativeElement, this.config);
    this.grid.updateAllCharacteristic([this.characteristic]);
  }

  private deleteStage(stage: Stage) {
    this.characteristic.stages.splice(this.characteristic.stages.indexOf(stage), 1);
  }

  private createNewStage(stage: Stage) {
    console.log("Create new stage", stage);
    this.characteristic.stages.push(stage);
    this.grid.updateAllCharacteristic([this.characteristic]);
  }

  private editExistStage(editStage: Stage) {
    var stages = this.characteristic.stages;
    for (let i in stages) {
      if (stages[i].id === editStage.id) {
        stages[i] = editStage;
        break;
      }
    }
    this.grid.updateAllCharacteristic([this.characteristic]);
  }

  changeTypeProtection(){
    this.characteristic.stages = [];
    //this.selectedFusePointsTemplate = null;
    //this.selectedSwitcherPointsTemplate = null;
  }


  //I think this feature we have to take out into the seperate component or create service
  fusePointsTemplates: PointsTemplate[] = defaultFusePointTemplates;
  //selectedFusePointsTemplate: PointsTemplate;
  builderStage = new BuilderStage();

  buildFuseCharacteristic(){
    if (this.characteristic.pointsTemplate !=null) {
      let stage: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[0], this.characteristic);
      (<PointsAbsStage> stage).points = this.characteristic.pointsTemplate.points.map(point => new Point(point.x, point.y));
      this.characteristic.stages = [stage];
    } else{
      this.characteristic.stages = [];
    }
  }

  switcherPointsTemplates: PointsTemplate[] = defaultSwitcherPointTemplates;
  //selectedSwitcherPointsTemplate: PointsTemplate;
  buildSwitcherCharacteristic(){
    if (this.characteristic.pointsTemplate !=null) {
      let stage: Stage = this.builderStage.buildStageByTemplate(defaultStageTemplates[1], this.characteristic);
      (<PointsRelativeStage> stage).points = this.characteristic.pointsTemplate.points.map(point => new Point(point.x, point.y));
      this.characteristic.stages = [stage];
    } else{
      this.characteristic.stages = [];
    }
  }

}
