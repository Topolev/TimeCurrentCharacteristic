import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {CoordinatePlaneModule} from "./draw-tripping-characteristics/coordinate-plane.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home.component";
import {ToolsComponent} from "./components/tools.component";
import {TimeCurrentCharacteristic} from "./components/tools/time-current-characteristics.component";


const appRoutes: Routes = [
  { path: 'home-page', component: HomeComponent },
  { path: 'tools', component: ToolsComponent},
  { path: 'time-current-characteristics', component: TimeCurrentCharacteristic},
  { path: '',
    redirectTo: '/home-page',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:      [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    CoordinatePlaneModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ToolsComponent,
    TimeCurrentCharacteristic
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
