import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AreaTemplate, Area} from "../coordinate-panel/area-template";
import CoordinatePlane from "../coordinate-panel/CoordinatePlane";
import {ConfigCoordinatePanel, defaultConfig} from "../coordinate-panel/ConfigCoordinatePanel";
import {CharacteristicService} from "./characteristic.service";
import {subscribeOn} from "rxjs/operator/subscribeOn";
import {Characteristic} from "../coordinate-panel/Characteristic";

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

  constructor(private modalService: NgbModal,
              private activeModal: NgbActiveModal,
              private characteristicService: CharacteristicService) {
    characteristicService.currentCharacteristic$.subscribe(
      characteristic => {
        this.characteristic = characteristic ? characteristic : new Characteristic();
        this.idCharacteristic = characteristic ? characteristic.id : Date.now();
        console.log(this.grid);
        //this.grid.updateAllCharacteristic([this.characteristic]);
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

  private deleteArea(area: Area) {
    this.characteristic.areas.splice(this.characteristic.areas.indexOf(area), 1);
  }

  private createNewArea(area: Area) {
    this.characteristic.areas.push(area);
    this.grid.updateAllCharacteristic([this.characteristic]);
  }


  private editExistArea(editArea: Area) {
    var areas = this.characteristic.areas;
    for (let i in areas) {
      if (areas[i].id === editArea.id) {
        areas[i] = editArea;
        break;
      }
    }
    this.grid.updateAllCharacteristic([this.characteristic]);
  }


}
