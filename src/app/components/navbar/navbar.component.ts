import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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

  constructor( private service: NodeService ) { }

  nombre = localStorage.getItem('nombreEmpleado');
  ngOnInit() {
  }

  // async buscar(name) {
  //   const h = new Date();
  //   const ho = moment(h);
  //   const hoy = ho.format('YYYY-MM-DD');
  //
  //   console.log(name.value, hoy);
  //
  //   await this.service.buscarPedidoNombre(hoy, name.value).subscribe(resp => {
  //     this.service.pedidosPorBusqueda(resp);
  //   });
  // }

  logout() {
    this.service.logout().subscribe(resp => {
      localStorage.clear();
      location.reload();
    });
  }

}
