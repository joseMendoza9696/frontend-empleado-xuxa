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
      this.pedidos = resp;
      // console.log(this.pedidos);
      this.pedidos = await this.listarProductos(this.pedidos);
      await this.listarCategorias();
      console.log(this.pedidos);
    });

    this.node.ingresoTotal(hoy).subscribe( (resp) => {
      this.ingresos = resp['ingreso'];
    });
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
    const fechaB = moment(fecha.value);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.fechaActualBusqueda = fechaBusqueda;
    this.fechaActualBusquedaFormat = fechaB;

    this.node.ingresoTotal(fechaBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(fechaBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
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
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }

  nextPage() {
    this.pageSkip = this.pageSkip + this.pageLimit;

    this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }

  previousPage() {
    this.pageSkip = this.pageSkip - this.pageLimit;

    this.node.ingresoTotal(this.fechaActualBusqueda).subscribe( resp => {
      this.ingresos = resp['ingreso'];
    });

    this.node.fechaPedidos(this.fechaActualBusqueda, this.pageLimit, this.pageSkip).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }


}
