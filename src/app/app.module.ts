import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {CoordinatePlaneModule} from "./draw-tripping-characteristics/coordinate-plane.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports:      [
    BrowserModule,
    CoordinatePlaneModule,
    NgbModule.forRoot(),
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
