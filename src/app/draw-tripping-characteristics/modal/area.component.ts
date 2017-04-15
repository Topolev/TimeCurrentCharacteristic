import {Component, Output, EventEmitter, ViewChild, ElementRef, Input} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Point from "../coordinate-panel/Point";
import {PointsTemplate} from "../coordinate-panel/PointsTemplate";
import {Characteristic} from "../coordinate-panel/characteristic/Characteristic";
import {StageTemplate, defaultStageTemplates} from "../coordinate-panel/classes/StageTemplate";
import {BuilderStage} from "../coordinate-panel/classes/BuilderStage";
import Stage from "../coordinate-panel/classes/Stage";
import PointsStage from "../coordinate-panel/classes/PointsStage";
import PointsAbsStage from "../coordinate-panel/classes/PointsAbsStage";
declare var jQuery: any;
declare var katex: any;

@Component({
  selector: 'create-new-area-modal',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class CreateNewArea {

  builderStage: BuilderStage;

  selectedStageTemplate: StageTemplate;

  stageTemplates: StageTemplate[];


  currentStage: Stage;
  isEditMode: boolean = false;
  idStage:number;
  label:string;

  @ViewChild("content") content: ElementRef;

  @Input() characteristic: Characteristic;
  @Output() onNewStage = new EventEmitter<Stage>();
  @Output() onEditStage = new EventEmitter<Stage>();

  constructor(
    private modalService: NgbModal) {
    this.stageTemplates = defaultStageTemplates;
    this.builderStage = new BuilderStage();
  }

  buildStage() {
    this.currentStage = this.builderStage.buildStageByTemplate(this.selectedStageTemplate, this.characteristic);
    this.currentStage.id = this.idStage;

    console.log("Build ", this.currentStage);
  }


  findStageTemplateById(id: number): StageTemplate {
    for (let stageTemplate of defaultStageTemplates) {
      if (stageTemplate.id === id) return stageTemplate;
    }
    return null;
  }

  addPoint(){
    console.log("add point");
    console.log(this.currentStage);
    (<PointsStage> this.currentStage).points.push(new Point())
  }

  deletePoint(point:Point){
    (<PointsStage> this.currentStage).points.splice((<PointsAbsStage> this.currentStage).points.indexOf(point),1);
  }

  open(stage: Stage) {
    console.log("OPEN CREATE STAGE");


    if (stage) {
      this.isEditMode = true;
      this.label = stage.label;
      this.idStage = stage.id;
      this.currentStage = stage;
      this.selectedStageTemplate = stage.stageTemplate;
    } else {
      this.idStage = Date.now();
      this.isEditMode = false;
    }

    console.log("Stage: ",this.currentStage);

    this.modalService.open(this.content).result.then(() => {
      this.currentStage.label = this.label;
      this.currentStage.stageTemplate = this.selectedStageTemplate;
      //this.currentArea.pointsTemplate = this.selectedPointsTemplate;
      if (this.isEditMode) {
        this.onEditStage.emit(this.currentStage);
      } else {
        this.onNewStage.emit(this.currentStage);
      }
      this.clearAllData();
    }, () => {
      this.clearAllData();
    });
  }

  clearAllData(){
    this.selectedStageTemplate = null;
    this.label = "";
    this.currentStage = null;
    jQuery('body').addClass('modal-open');
  }

}
