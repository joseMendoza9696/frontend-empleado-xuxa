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
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  }

  // pedidos: any = GlobalConstant.pedidosBusqueda ;
  pedidos: any = '';

  fechaActualBusqueda: any;
  fechaActualBusquedaFormat: any;


  ingresos = 0;
  categorias: any = '';

  pageLimit: number = 10;
  pageSkip: number = 0;

  constructor(private node: NodeService) {
  }

  ngOnInit() {

    const h = new Date();
    const ho = moment(h);
    const hoy = ho.format('YYYY-MM-DD');

    this.fechaActualBusqueda = hoy;
    this.fechaActualBusquedaFormat = ho;


    this.node.fechaPedidos(hoy, this.pageLimit, this.pageSkip).subscribe(async (resp) => {
      // this.pedidos = resp;
      // this.pedidos = await this.listarProductos(this.pedidos);

      this.ordenarPedidosProductos(resp);

      await this.listarCategorias();
      // console.log(this.pedidos);
    });

    this.node.ingresoTotal(hoy).subscribe( (resp) => {
      console.log(resp);
      this.ingresos = resp['ingreso'];
    });
  }

  async ordenarPedidosProductos(resp) {
    this.pedidos = resp;
    this.pedidos = await this.listarProductos(this.pedidos);
  }

  convertirFecha(fecha) {
    return fecha.format('dddd, D [de] MMMM [del] YYYY');
  }

  listarProductos(pedidos: any) {
    let categ = '';
    // this.ingresos = 0;

    for ( let i = 0; i < pedidos.length; i++) {
      const pedido = pedidos[i];
      // this.ingresos = this.ingresos + pedido.cuenta_pedido;

      for (let j = 0; j < pedido.orden.length; j++) {
        const orden = pedido.orden[j];

        this.node.listarProducto( orden.producto_id ).subscribe( resp => {
          // console.log(resp);
          for (let k = 0; k < this.categorias.length; k++) {
            if ( resp['categoria_id'] === this.categorias[k]._id ) {
              console.log('categorias iguales');
              categ = this.categorias[k].nombre;
            }
          }
          pedidos[i].orden[j] = {
            ...orden,
            producto: resp,
            categoria: categ
          };
        });
      }
    }

    return pedidos;
  }

  listarCategorias() {
    this.node.listarCategorias().subscribe(resp => {
      this.categorias = resp;

      console.log(this.categorias);
    });
  }

  fechaPedido( fecha: any ) {
    // console.log(fecha.value);
    // this.ingresos = 0;
    console.log(fecha.value);
    console.log(typeof(fecha.value));

    let d12 = new Date(fecha.value);

    console.log(d12);

    const fechaB = moment(d12);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.fechaActualBusqueda = fechaBusqueda;
    this.fechaActualBusquedaFormat = fechaB;

    this.node.ingresoTotal(fechaBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(fechaBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      // this.pedidos = resp;
      // this.pedidos = this.listarProductos(this.pedidos);

      this.ordenarPedidosProductos(resp);

      console.log(this.pedidos);
    });
  }

  pedidosHoy() {
    console.log('hoy');
    const fecha = new Date();
    const fechaB = moment(fecha);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.fechaActualBusqueda = fechaBusqueda;
    this.fechaActualBusquedaFormat = fechaB;

    this.node.ingresoTotal(fechaBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(fechaBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      // this.pedidos = resp;
      // this.pedidos = this.listarProductos(this.pedidos);
      this.ordenarPedidosProductos(resp);

      console.log(this.pedidos);
    });
  }

  nextPage() {
    this.pageSkip = this.pageSkip + this.pageLimit;

    this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      // this.pedidos = resp;
      // this.pedidos = this.listarProductos(this.pedidos);
      this.ordenarPedidosProductos(resp);

      console.log(this.pedidos);
    });
  }

  previousPage() {
    this.pageSkip = this.pageSkip - this.pageLimit;

    this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      // this.pedidos = resp;
      // this.pedidos = this.listarProductos(this.pedidos);
      this.ordenarPedidosProductos(resp);

      console.log(this.pedidos);
    });
  }

  recibirMensaje(event) {
    console.log('buscador...', event);
    // this.pedidos = event;
    // this.pedidos = this.listarProductos(this.pedidos);
    this.ordenarPedidosProductos(event);
  }

}
