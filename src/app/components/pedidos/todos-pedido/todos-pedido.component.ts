import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../../services/node.service';
import { Router } from '@angular/router';

import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-todos-pedido',
  templateUrl: './todos-pedido.component.html',
  styles: []
})
export class TodosPedidoComponent implements OnInit {

  pedidos: any = [];

  constructor( private node: NodeService, private router: Router ) { }

  ngOnInit() {
    console.log(this.pedidos);
    this.node.todosPedidos().subscribe( resp => {
      this.pedidos = resp;
      // console.log(this.pedidos);
      this.pedidos = this.listarProductos(this.pedidos);
      
      console.log(this.pedidos);
    });
  }

  fechaPedido( fecha: any ) {
    console.log(fecha.value);
    let fechaB = moment(fecha.value);
    let fechaBusqueda = fechaB.format('YYYY-MM-DD');
    console.log(fechaBusqueda);

    this.node.fechaPedidos(fechaBusqueda).subscribe( resp => {
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

  getFecha(fecha: Date) {
    let ff = moment(fecha);
    return ff.format('LLLL a');
  }

  getProducto(id: string) {
    this.node.listarProducto(id).subscribe( resp => {
      return resp;
    });
  }

  recargar() {
    this.ngOnInit();
  }

}
