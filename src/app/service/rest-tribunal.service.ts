import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RestTribunalService {

  constructor( private http: HttpClient) {
    console.log('servicio rest listo');
   }
   getNotificadores() {
   return  this.http.get('https://actuarios-rest-api.tribunalqro.gob.mx/v1/notificadores/');
   }
   getExpedientes() {
   return this.http.get('https://actuarios-rest-api.tribunalqro.gob.mx/v1/notificaciones?notificador=0&estatus=todas');
   }
}
