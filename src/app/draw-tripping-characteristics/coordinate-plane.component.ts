/**
 * Created by Vladimir on 22.03.2017.
 */

import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from "@angular/core";
import CoordinatePlane from "./coordinate-panel/CoordinatePlane";
import {ConfigCoordinatePanel, defaultConfig} from "./coordinate-panel/ConfigCoordinatePanel";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {CharacteristicService} from "./modal/characteristic.service";
import {Characteristic} from "./coordinate-panel/Characteristic";
import {CurrentSlice} from "./coordinate-panel/CurrentSlice";
import {defaultVoltageSteps} from "./coordinate-panel/VoltageSteps";



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
    this.grid = new CoordinatePlane(this.canvas.nativeElement, this.canvasBack.nativeElement, this.config);
    //katex.render("t = \\frac{0.14k}{(I/I_{sz})^{0,02}-1}", this.test.nativeElement)
  }


  addNewGraph() {
    console.log("Add");
  }

  rerender() {
    this.grid.render(this.config);
  }

  changeConfig(){
    this.grid.updateConfigPanel();
  }

  openModal(characterisctic: Characteristic) {
    this.modalService.open(CharacteristicComponent, {windowClass: 'modal-create-new-graph'});
    this.chactericticService.setCurrentCharacteristic(characterisctic);
  }

  changeVisable(characteristic: Characteristic){
    characteristic.visable = !characteristic.visable;
    this.grid.addCharacteristics(this.characteristics);
  }

  changeCurrentSlices(){
    this.grid.addCurrentSlices(this.currentSlices);
  }


  deleteCharacteristic(characteristic : Characteristic){
    this.characteristics.splice(this.characteristics.indexOf(characteristic),1);
  }

  addCurrentSlice(){
    this.currentSlices.push(new CurrentSlice());
    this.changeCurrentSlices();
  }

  deleteCurrentSlice(currentSlice: CurrentSlice){
    this.currentSlices.splice(this.currentSlices.indexOf(currentSlice), 1);
    this.changeCurrentSlices();
  }



}
