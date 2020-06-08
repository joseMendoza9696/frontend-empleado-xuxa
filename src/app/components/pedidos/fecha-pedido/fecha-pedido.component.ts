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

  constructor( private node: NodeService ) { }

  ngOnInit() {
    let h = new Date();
    let ho = moment(h);
    let hoy = ho.format('YYYY-MM-DD');


    this.node.fechaPedidos(hoy).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }

  listarProductos(pedidos: any) {

    for (let i = 0; i < pedidos.length; i++) {
      let pedido = pedidos[i];

      for (let j = 0; j < pedido.orden.length; j++) {
        let orden = pedido.orden[j];

        this.node.listarProducto( orden.id_producto ).subscribe( resp => {
          pedidos[i].orden[j] = {
            ...orden,
            producto: resp
          };
        });
      }
    }

    return pedidos;
  }

  fechaPedido( fecha: any ) {
    // console.log(fecha.value);
    let fechaB = moment(fecha.value);
    let fechaBusqueda = fechaB.format('YYYY-MM-DD');
    console.log(fechaBusqueda);

    this.node.fechaPedidos(fechaBusqueda).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }

  pedidosHoy() {
    console.log('hoy');
    let fecha = new Date();
    let fechaB = moment(fecha);
    let fechaBusqueda = fechaB.format('YYYY-MM-DD');

    this.node.fechaPedidos(fechaBusqueda).subscribe( resp => {
      this.pedidos = resp;
      this.pedidos = this.listarProductos(this.pedidos);
      console.log(this.pedidos);
    });
  }

  completar(index: number) {
    console.log(this.pedidos[index]);
    this.node.actualizarPedido(this.pedidos[index]._id).subscribe( resp => {
      console.log(resp);
      this.ngOnInit();
    });
  }

}
