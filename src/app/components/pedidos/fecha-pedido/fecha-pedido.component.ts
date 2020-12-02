import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../../services/node.service';

import * as moment from 'moment';
import 'moment/locale/es';


@Component({
  selector: 'app-fecha-pedido',
  templateUrl: './fecha-pedido.component.html',
  styles: []
})

export class FechaPedidoComponent implements OnInit {

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    return true;
  }

  pizzas: string = '5f51986daf3d7403b74f919b';
  alitas: string = '5f519a31af3d7403b74f91a5';
  refrescos: string = '5f51984faf3d7403b74f919a';
  helados: string = '5f51987caf3d7403b74f919c';

  pedidos: any = '';

  fechaActualBusqueda: any;
  fechaActualBusquedaFormat: any;


  ingresos = 0;
  categorias: any = '';

  pageLimit: number = 10;
  pageSkip: number = 0;

  constructor(private node: NodeService) {
  }

  async ngOnInit() {

    const h = new Date();
    const ho = moment(h);
    const hoy = ho.format('YYYY-MM-DD');

    this.fechaActualBusqueda = hoy;
    this.fechaActualBusquedaFormat = ho;


    await this.node.fechaPedidos(hoy, this.pageLimit, this.pageSkip).subscribe(async (resp) => {

      this.pedidos = resp;


      await this.listarCategorias();
      console.log(this.pedidos);
    });

    await this.node.ingresoTotal(hoy).subscribe( (resp) => {
      console.log(resp);
      this.ingresos = resp['ingreso'];
    });

  }

  convertirFecha(fecha) {
    return fecha.format('dddd, D [de] MMMM [del] YYYY');
  }

  async listarCategorias() {
    await this.node.listarCategorias().subscribe(resp => {
      this.categorias = resp;
    });
  }

  async fechaPedido( fecha: any ) {
    let d12 = new Date(fecha.value);

    const fechaB = moment(d12);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.fechaActualBusqueda = fechaBusqueda;
    this.fechaActualBusquedaFormat = fechaB;

    await this.node.ingresoTotal(fechaBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    await this.node.fechaPedidos(fechaBusqueda, this.pageLimit, this.pageSkip).subscribe( async (resp) => {
      this.pedidos = resp;

      console.log(resp);
    });
  }

  async pedidosHoy() {
    console.log('hoy');
    const fecha = new Date();
    const fechaB = moment(fecha);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.fechaActualBusqueda = fechaBusqueda;
    this.fechaActualBusquedaFormat = fechaB;

    await this.node.ingresoTotal(fechaBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    await this.node.fechaPedidos(fechaBusqueda, this.pageLimit, this.pageSkip).subscribe( async (resp) => {
      this.pedidos = resp;

      console.log(this.pedidos);
    });
  }

  async nextPage() {
    this.pageSkip = this.pageSkip + this.pageLimit;

    await this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    await this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( async (resp) => {
      this.pedidos = resp;

      console.log(this.pedidos);
    });
  }

  async previousPage() {
    this.pageSkip = this.pageSkip - this.pageLimit;

    await this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    await this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( async (resp) => {
      this.pedidos = resp;

      console.log(this.pedidos);
    });
  }

  async recibirMensaje(event) {
    console.log('buscador...', event);
    this.pedidos = event;
  }


}
