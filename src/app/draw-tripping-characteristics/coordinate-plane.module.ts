import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CoordinatePlaneComponent} from "./coordinate-plane.component";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CharacteristicComponent} from "./modal/characteristic.component";
import {CreateNewArea} from "./modal/area.component";
import {CharacteristicService} from "./modal/characteristic.service";
import {RenderTexStandardComponent} from "./modal/render-tex-standard.conponent";


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
