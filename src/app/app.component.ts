import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './core/data.service';
import { Subscription } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { Socket } from './shared/interfaces';
declare var io : {
  connect(url: string): Socket;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  stockQuote = {};
  sub: Subscription;
  lat:any;
  lon:any;
  socket: Socket;
  latitud = 20.577236100000004;
  longitud = -100.3802213;
  zoom = 15;
  constructor(private dataService: DataService) {

   }

  ngOnInit() {
    /*this.sub = this.dataService.getQuotes()
        .subscribe(quote => {
          //this.stockQuote = quote;
          console.log(quote);
          this.stockQuote = quote;
         // var location =  JSON.parse(JSON.stringify(quote));
        //  console.log(location.lat + " " + location.lon)

        });*/
        this.socket = socketIo('localhost:3000');

        this.socket.on('data', (res) => {
        //  JSON.stringify("servicio " + res);
          console.log(res);
          var location =  JSON.parse(JSON.stringify(res));
          console.log(location.lat + " " + location.lon)

             this.lat= parseFloat(location.lat);
             this.lon= parseFloat(location.lon) ;

        // this.observer.next(res.data);
        });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
