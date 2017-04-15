import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CoordinatePlaneComponent} from "./coordinate-plane.component";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicService} from "./modal/characteristic.service";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {RenderTexStandardComponent} from "./modal/render-tex-standard.conponent";
import {CreateNewArea} from "./modal/area.component";


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    CoordinatePlaneComponent,
    CharacteristicComponent,
    RenderTexStandardComponent,
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
