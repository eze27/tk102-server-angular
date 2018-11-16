import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { GpsService } from './service/gps.service';
import { pipe } from '@angular/core/src/render3/pipe';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  lat: any;
  lon: any;
  latitud: any;
  longitud: any;
  zoom: any;
  datagps;
  estado: boolean;
  siguiendoA: any;
  siguiendoNombre: any;
  usuariosconectados = [];
  constructor(private gps: GpsService) {}

  ngOnInit() {
    this.latitud = 20.577236100000004;
    this.longitud = -100.3802213;
    this.zoom = 15;
    this.estado = false;
    this.gps.getLatLng().subscribe(data => {



      if ( this.isEmpty(data)) {
          console.log('viene vacio');
      } else {
        console.log('hay datos' + data);
        this.estado = true;
        this.datagps = data;
      }

    });
  }
  isEmpty(obj) {
    for ( const key in obj) {
        if ( obj.hasOwnProperty(key) ) {
            return false;
        }
    }
    return true;
}
  seguir(idnotificador) {
    console.log('id ' + idnotificador );
    // tslint:disable-next-line:forin
    const data = Object.values(this.datagps);
    // Step 2. Create an empty array.
   console.log(JSON.stringify(data));
   for (let index = 0; index < data.length; index++) {
    console.log('index ' + index + ' ' + data[index]['idnotificador'] );
    if (idnotificador  == data[index]['idnotificador'] ) {
      this.estado = true;
      this.siguiendoA = undefined;
      this.siguiendoNombre = data[index]['idnotificador'];
      this.latitud = parseFloat(data[index]['lat']);
      this.longitud = parseFloat(data[index]['lon']);

      this.zoom = 18;
      if ( data[index]['lat'] === undefined && data[index]['lon'] === undefined ) {
        this.latitud = 20.577236100000004;
        this.longitud = -100.3802213;
        this.zoom = 15;
        this.estado = false;
      } else {
        this.zoom = 18;
      }
    }
   }
  }
}
