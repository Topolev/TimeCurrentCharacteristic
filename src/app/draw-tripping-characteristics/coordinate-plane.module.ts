import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CoordinatePlaneComponent} from "./coordinate-plane.component";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {CreateNewArea} from "./modal/create-new-area";
import {CharacteristicService} from "./modal/characteristic.service";


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    CoordinatePlaneComponent,
    CharacteristicComponent,
    CreateNewArea
  ],
  entryComponents: [
    CharacteristicComponent
  ],
  exports:      [
    CoordinatePlaneComponent
  ],
  providers: [
    CharacteristicService
  ]
})
export class CoordinatePlaneModule{}
