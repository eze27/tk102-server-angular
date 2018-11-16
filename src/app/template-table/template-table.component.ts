import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { RestTribunalService } from '../service/rest-tribunal.service';
import { HistorialService } from '../service/historial.service';
import { Subject, Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.css']
})
export class TemplateTableComponent implements OnInit {
  lat: any;
  lon: any;
  latitud = 20.577236100000004;
  longitud = -100.3802213;
  zoom = 15;
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();
  dtTrigger: Subject<any> = new Subject();
  dtTrigger3: Subject<any> = new Subject();
  notificadores: any;
  expedientes: any;
  modalRef: BsModalRef;
  history: any;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  input1 = new Date();
  input2 = new Date();
  dd: any;
  mm: any;
  dd2: any;
  mm2: any;
  idnotificador: any;
  @Output() idSeleccionado: EventEmitter<number>;
  // tslint:disable-next-line:max-line-length
  constructor(
    private rest: RestTribunalService,
    private modalService: BsModalService,
    private historial: HistorialService,
    private localeService: BsLocaleService
  ) {
    this.localeService.use('es');
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.minDate = new Date(2017, 5, 10);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.idSeleccionado = new EventEmitter();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple',
      pageLength: 5,
      responsive: true
    };
    this.rest.getNotificadores().subscribe(notificadores => {
      console.log(JSON.stringify(notificadores));
      this.notificadores = notificadores;
      this.dtTrigger.next();
    });
    this.rest.getExpedientes().subscribe(expedientes => {
      console.log(JSON.stringify(expedientes));
      this.expedientes = expedientes;
      this.dtTrigger2.next();
    });
  }
  openModal(template: TemplateRef<any>, iduser) {
    this.idnotificador = iduser;
    this.modalRef = this.modalService.show(template);
    this.latitud = 20.577236100000004;
    this.longitud = -100.3802213;
    this.zoom = 15;
    this.historial.getHistorial(iduser).subscribe(data => {
      console.log(JSON.stringify(data));
      this.history = data;
      if (data[0] === undefined) {
        console.log('vacio');
         this.history = data;
      } else {
          console.log('hay datos ' + data[0]);
          this.history = data;
      }

    });
  }
  seguir(idejecutor) {
      this.idSeleccionado.emit( idejecutor );
  }
  calculafechas() {
    this.convierte_fecha();
  }
  convierte_fecha() {
    this.dd = this.addZero(this.input1.getDate());
    this.mm = this.addZero(this.input1.getMonth() + 1);
    const yyyy = this.input1.getFullYear();
    this.dd2 = this.addZero(this.input2.getDate());
    this.mm2 = this.addZero(this.input2.getMonth() + 1);
    const yyyy2 = this.input2.getFullYear();

    const fecha1 = yyyy + '-' + this.mm + '-' + this.dd;
    const fecha2 = yyyy2 + '-' + this.mm2 + '-' + this.dd2;
    console.log(fecha1 + ' - ' + fecha2);
    this.history = {};
    this.historial.getHistorial_parametros(this.idnotificador, fecha1, fecha2 ).subscribe(data => {
        console.log(data );

        this.history = data;
    });
  }
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
}
