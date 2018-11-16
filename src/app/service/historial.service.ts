import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor( private http: HttpClient) {
    console.log('servicio historial listo');
   }
  getHistorial(imei) {
    return  this.http.get(`http://localhost/Api-Rest/index.php/expediente/historial/${imei}`);
  }
  getHistorial_parametros(imei, fechainicial, fechafinal) {
    return  this.http.get(`http://localhost/Api-Rest/index.php/expediente/historial_parametros/${imei}/${fechainicial}/${fechafinal}`);
  }
}
