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
  fechaBusca: Date;
  ingresos = 0;
  categorias: any = '';

  constructor(private node: NodeService) {
  }

  ngOnInit() {

    const h = new Date();
    const ho = moment(h);
    const hoy = ho.format('YYYY-MM-DD');


    this.node.fechaPedidos(hoy).subscribe(async (resp) => {
      this.pedidos = resp;
      // console.log(this.pedidos);
      this.pedidos = await this.listarProductos(this.pedidos);
      await this.listarCategorias();
      console.log(this.pedidos);
    });
  }

  // ORDEN
  // cantidad: 1
  // categoria: "helados"
  // descripcion: ""
  // producto: {
  //    categoria_id: "5f51987caf3d7403b74f919c"
  //    nombre: "Helado en vaso (2 porciones)"
  //    precio: 6
  // }
  // _id: "5f519b1caf3d7403b74f91aa"

  listarProductos(pedidos: any) {
    let categ = '';
    this.ingresos = 0;

    for ( let i = 0; i < pedidos.length; i++) {
      const pedido = pedidos[i];
      this.ingresos = this.ingresos + pedido.cuenta_pedido;

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
    this.ingresos = 0;
    const fechaB = moment(fecha.value);
    const fechaBusqueda = fechaB.format('YYYY-MM-DD');
    console.log(fechaBusqueda);

    this.node.fechaPedidos(fechaBusqueda).subscribe( resp => {
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

    this.node.fechaPedidos(fechaBusqueda).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }


}
