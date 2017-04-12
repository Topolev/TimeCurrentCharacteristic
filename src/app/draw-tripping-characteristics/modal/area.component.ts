import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AreaTemplate, defaultAreaTemplates, Area} from "../coordinate-panel/area-template";
import {Builder} from "selenium-webdriver";
import {BuilderArea} from "../coordinate-panel/area-builder";
import Point from "../coordinate-panel/Point";
import {PointsTemplate, defaultPointsTemplate} from "../coordinate-panel/PointsTemplate";
declare var jQuery: any;
declare var katex: any;

@Component({
  selector: 'create-new-area-modal',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class CreateNewArea {

  builderArea: BuilderArea;

  selectedAreaTemplate: AreaTemplate;
  selectedPointsTemplate: PointsTemplate = null;

  areaTemplates: AreaTemplate[];
  pointsTemplates: PointsTemplate[];


  currentArea: Area;
  isEditMode: boolean = false;
  idArea:number;
  label:string;

  @ViewChild("content") content: ElementRef;

  @Output() onNewArea = new EventEmitter<Area>();
  @Output() onEditArea = new EventEmitter<Area>();

  constructor(
    private modalService: NgbModal) {
    this.areaTemplates = defaultAreaTemplates;
    this.pointsTemplates = defaultPointsTemplate;

    this.builderArea = new BuilderArea();
  }

  buildArea() {
    this.currentArea = this.builderArea.buildAreaByTemplate(this.selectedAreaTemplate);
    this.currentArea.id = this.idArea;
  }

  buildPointsTemplate(){
    if (this.selectedPointsTemplate !=null) {
      this.currentArea.points = this.selectedPointsTemplate.points.map(point => new Point(point.x, point.y));
    } else{
      this.currentArea.points = [];
    }
  }

  findAreaTemplateById(id: number): AreaTemplate {
    for (let areaTemplate of defaultAreaTemplates) {
      if (areaTemplate.id === id) return areaTemplate;
    }
    return null;
  }

  addPoint(){
    console.log("add point");
    this.currentArea.points.push(new Point())
  }
  deletePoint(point:Point){
    this.currentArea.points.splice(this.currentArea.points.indexOf(point),1);
  }

  open(area: Area) {
    if (area) {
      this.isEditMode = true;
      this.label = area.label;
      this.idArea = area.id;
      this.currentArea = area;
      this.selectedAreaTemplate = area.areaTemplate;
      this.selectedPointsTemplate = area.pointsTemplate;
    } else {
      this.idArea = Date.now();
      this.isEditMode = false;
    }
    this.modalService.open(this.content).result.then(() => {
      this.currentArea.label = this.label;
      this.currentArea.areaTemplate = this.selectedAreaTemplate;
      this.currentArea.pointsTemplate = this.selectedPointsTemplate;
      if (this.isEditMode) {
        this.onEditArea.emit(this.currentArea);
      } else {
        this.onNewArea.emit(this.currentArea);
      }
      this.clearAllData();
    }, () => {
      this.clearAllData();
    });
  }

  clearAllData(){
    this.selectedAreaTemplate = null;
    this.label = "";
    this.currentArea = null;
    jQuery('body').addClass('modal-open');
  }

  renderFormulaForExpression(){

  }


}
