import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AreaTemplate, defaultAreaTemplates, Area} from "../coordinate-panel/area-template";
import {Builder} from "selenium-webdriver";
import {BuilderArea} from "../coordinate-panel/area-builder";

@Component({
  selector: 'create-new-area-modal',
  templateUrl: './create-new-area.html'
})
export class CreateNewArea {

  builder: BuilderArea;
  selectedAreaTemplate: AreaTemplate;
  areaTemplates: AreaTemplate[];
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
    this.builder = new BuilderArea();
  }

  buildArea() {
    this.currentArea = this.builder.buildAreaByTemplate(this.selectedAreaTemplate);
    this.currentArea.id = this.idArea;
  }

  findAreaTemplateById(id: number): AreaTemplate {
    for (let areaTemplate of defaultAreaTemplates) {
      if (areaTemplate.id === id) return areaTemplate;
    }
    return null;
  }

  open(area: Area) {
    if (area) {
      this.isEditMode = true;
      this.label = area.label;
      this.idArea = area.id;
      this.currentArea = area;
      this.selectedAreaTemplate = area.areaTemplate;
    } else {
      this.idArea = Date.now();
      this.isEditMode = false;
    }
    this.modalService.open(this.content).result.then(() => {
      this.currentArea.label = this.label;
      this.currentArea.areaTemplate = this.selectedAreaTemplate;
      if (this.isEditMode) {
        this.onEditArea.emit(this.currentArea);
      } else {
        this.onNewArea.emit(this.currentArea);
      }
      this.selectedAreaTemplate = null;
      this.label = "";
      this.currentArea = null;
    }, () => {
    });
  }


}
