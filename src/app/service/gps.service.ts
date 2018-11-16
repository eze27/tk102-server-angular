import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Socket } from '../shared/interfaces';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
declare var io: {
  connect(url: string): Socket;
};
@Injectable({
  providedIn: 'root'
})
export class GpsService {
  socket: Socket;
  constructor(private http: HttpClient) {
    console.log('servicio gps listo');
  }
  getLatLng(): Observable<any> {
    this.socket = socketIo('localhost:3000');
    /*
    const data =  this.socket.on('data', res => {
      //  JSON.stringify('servicio ' + res);
       location = JSON.parse(JSON.stringify(res));
    });*/
    return new Observable(observer => {
      // tslint:disable-next-line:no-shadowed-variable
    this.socket.on('data', ( data ) => {
         console.log( data ) ;
        observer.next(data);
      } );
     /* this.socket.on('sockets', ( data ) => {
         console.log('sockets'  + JSON.parse(JSON.stringify(data)) ) ;
      } );*/
  });
  }
}
