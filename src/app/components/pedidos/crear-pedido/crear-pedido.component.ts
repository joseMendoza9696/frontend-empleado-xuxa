import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';

import { PedidoModel } from '../../../models/pedido.model';
import { NodeService } from '../../../services/node.service';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styles: []
})
export class CrearPedidoComponent implements OnInit {

  prod = '';
  categorias: any = '';

  pedido: PedidoModel = new PedidoModel();
  // tipo del producto
  tipoProducto: string = '';
  // lista de productos segun tipoProducto
  productos: any;
  // ordenes de nuestro pedido, esta en el formulario
  ordenes: any = [];
  ordenColor: any = [];
  // precio total del pedido
  precioTotal: number = 0;
  // numero de nit
  NIT: string = '';
  // array de las descripciones
  descrip: string[] = [];
  // array de las cantidades
  cant: number[] = [];
  // precios de cada pedido
  precios: number[] = [];
  ticket: any;

  extras: number = 0;

  constructor( private node: NodeService, private router: Router ) { }

  ngOnInit() {
    this.node.listarCategorias().subscribe(resp => {
      this.categorias = resp;
    });
  }

  pedirProductos(categoria: string, index) {
    this.prod = this.categorias[index].nombre;
    this.tipoProducto = this.categorias[index].nombre;

    this.node.listarProductosCategoria(categoria).subscribe( resp => {
      this.productos = resp;
    });
  }

  agregarOrden(index: number) {
    this.ordenes.push(this.productos[index]);
    this.ordenColor.push(this.prod);

    this.precios.push(this.productos[index].precio);
    this.cuentaTotal();

    console.log(this.ordenes);
    console.log(this.ordenColor);
  }

  quitarOrden(index: number) {
    // console.log(index);
    // this.precioTotal = this.precioTotal - this.ordenes[index].precio;
    this.ordenes.splice(index, 1);
    this.ordenColor.splice(index, 1);
    this.precios.splice(index, 1);
    this.descrip.splice(index, 1);
    this.cant.splice(index, 1);
    this.cuentaTotal();
  }

  login(form: NgForm) {
    if (form.invalid) { return ;}
    // if (this.pedido.orden === undefined) {
    //   return;
    // }

    let orden: any[] = [];

    for (let i = 0; i < this.ordenes.length; i++) {
      let o = this.ordenes[i];
      if (this.descrip[i] === undefined) {
        this.descrip[i] = ''
      }
      if (this.cant[i] === undefined) {
        this.cant[i] = 1;
      }
      orden[i] = {
        producto_id: o._id,
        descripcion: this.descrip[i],
        cantidad: this.cant[i]
      }
    }

    let h = new Date();
    let ho = moment(h);
    let hoy = ho.format('YYYY-MM-DD');
    let hora = ho.format('HH:mm a');


    // console.log(orden);
    this.pedido = {
      ...this.pedido,
      orden: orden,
      fecha_creacion: hoy,
      hora_creacion: hora,
      cuenta_pedido: this.precioTotal
    };

    console.log(this.pedido);

    this.node.crearPedido(this.pedido).subscribe( resp => {
      console.log(resp);
      this.imprimir();
      this.router.navigateByUrl('/#');
    });

  }

  descripcion(index: number, desc: any) {

    this.descrip[index] = desc.value;
  }

  cantidad(index: number, canti: any) {
    this.cant[index] = canti.value;

    this.precios[index] = canti.value * this.ordenes[index].precio;
    this.cuentaTotal();
    // console.log(this.cant);
  }

  agregarExtra( extra: any ) {
    console.log( parseInt(extra.value, 10) );
    this.extras = parseInt(extra.value, 10) ;
    this.cuentaTotal();
  }

  cuentaTotal() {
    console.log(this.precios);
    this.precioTotal = 0;
    for (let i = 0; i < this.precios.length; i++) {
      this.precioTotal = this.precioTotal + this.precios[i];
    }

    if ( isNaN(this.extras) || this.extras < 0) {
      return ;
    }

    this.precioTotal =  this.precioTotal + this.extras;
  }

  paraPedido(event) {
    this.pedido.tipo = event.target.value;
  }

  imprimir() {
    console.log('Imprimiendo...');

    const t = window.open('', '');
    t.document.writeln(`<p> <strong> ${ this.pedido.hora_creacion } </p>`);
    t.document.writeln(`<p> <strong>Cliente: </strong> ${this.pedido.nombre_cliente} </p>`);

    if (this.pedido.tipo === undefined) {
      t.document.writeln(`<p> <strong>Para: </strong> Llevar </p>`);
    } else {
      t.document.writeln(`<p> <strong>Para: </strong> ${this.pedido.tipo} </p>`);
    }

    t.document.writeln(`<p>__</p>`);

    for ( let i = 0; i < this.ordenColor.length; i++ ) {
      t.document.writeln(`<p> ${this.cant[i]} : <strong>${this.ordenColor[i]}:</strong> ${this.ordenes[i].nombre}  <strong>...</strong>  ${this.descrip[i]}</p>`);
    }
    t.document.close();
    t.focus();
    t.print();
  }

}
