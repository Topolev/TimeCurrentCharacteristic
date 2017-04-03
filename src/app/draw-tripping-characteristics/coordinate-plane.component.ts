/**
 * Created by Vladimir on 22.03.2017.
 */

import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from "@angular/core";
import CoordinatePlane from "./coordinate-panel/CoordinatePlane";
import Graph from "./coordinate-panel/graph";
import {ConfigCoordinatePanel, defaultConfig} from "./coordinate-panel/ConfigCoordinatePanel";
import {ModalComponent} from "ng2-bs4-modal/components/modal";
import {DialogService} from "ng2-bootstrap-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {CharacteristicService} from "./modal/characteristic.service";
import {Characteristic} from "./coordinate-panel/Characteristic";

declare var katex: any;

@Component({
  selector: 'coordinate-plane',
  templateUrl: './coordinate-plane.component.html',
  styleUrls: ['./coordinate-plane.component.css']

})
export class CoordinatePlaneComponent implements AfterViewInit {
  grid: CoordinatePlane = null;
  characteristics: Characteristic[] = [];

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvasBack') canvasBack: ElementRef;


  config: ConfigCoordinatePanel;

  constructor(private modalService: NgbModal,
              private chactericticService: CharacteristicService) {
    this.config = Object.assign({},defaultConfig);
    this.chactericticService.newCharacteristic$.subscribe(
      characteristic => {
        this.setCharacteristic(characteristic);
      }
    )
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

  ngAfterViewInit() {
    this.grid = new CoordinatePlane(this.canvas.nativeElement, this.canvasBack.nativeElement, this.config)
    //katex.render("t = \\frac{0.14k}{(I/I_{sz})^{0,02}-1}", this.test.nativeElement)
  }


  addNewGraph() {
    console.log("Add");
  }

  rerender() {
    this.grid.render(this.config);
  }

  openModal(characterisctic: Characteristic) {
    this.modalService.open(CharacteristicComponent, {windowClass: 'modal-create-new-graph'});
    this.chactericticService.setCurrentCharacteristic(characterisctic);
  }

  changeVisable(characteristic: Characteristic){
    characteristic.visable = !characteristic.visable;
    this.grid.addCharacteristics(this.characteristics);
  }


  deleteCharacteristic(characteristic : Characteristic){
    this.characteristics.splice(this.characteristics.indexOf(characteristic),1);
  }

}
