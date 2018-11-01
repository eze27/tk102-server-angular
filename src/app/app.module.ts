import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule, } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyClU4VthG7iySIBzUxWpQpz_WNBTNHsv7A',
      libraries: ['places']
    }),
    AgmDirectionModule,
    AgmSnazzyInfoWindowModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
