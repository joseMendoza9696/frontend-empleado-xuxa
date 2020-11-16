import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {NodeService} from '../../services/node.service';

import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {

  @Output() busqueda = new EventEmitter();
  @Input() fecha: string;

  constructor( private service: NodeService ) { }

  nombre: string = localStorage.getItem('nombreEmpleado');
  ngOnInit() {
    console.log('OnInit: ', this.fecha);
  }

  async buscar(name) {
    console.log('Buscar: ', this.fecha);

    await this.service.buscador(this.fecha, name.value).subscribe(resp => {
      this.busqueda.emit(resp);
    });
  }


  logout() {
    this.service.logout().subscribe(resp => {
      localStorage.clear();
      location.reload();
    });
  }

}
