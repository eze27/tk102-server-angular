import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule, } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { GpsService } from './service/gps.service';
import { RestTribunalService } from './service/rest-tribunal.service';
import { TemplateTableComponent } from './template-table/template-table.component';
import { HistorialService } from './service/historial.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TemplateDefaultComponent } from './template-table/template-default/template-default.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';

import { esLocale } from 'ngx-bootstrap/locale';
import { FormsModule , NgControl} from '@angular/forms';
import { ObjectPositionsPipe } from './pipe/object-positions.pipe';
// The string MUST be lower case - even though the examples give it as enGb
defineLocale('es', esLocale );
@NgModule({
  declarations: [
    AppComponent,
    TemplateTableComponent,
    TemplateDefaultComponent,
    ObjectPositionsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyClU4VthG7iySIBzUxWpQpz_WNBTNHsv7A',
      libraries: ['places']
    }),
    AgmDirectionModule,
    DataTablesModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule
  ],
  providers: [
    GpsService,
    RestTribunalService,
    HistorialService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
