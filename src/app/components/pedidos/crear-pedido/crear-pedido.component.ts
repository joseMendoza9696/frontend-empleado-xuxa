import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { PedidoModel } from '../../../models/pedido.model';
import { NodeService } from '../../../services/node.service';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styles: []
})
export class CrearPedidoComponent implements OnInit {

  pedido: PedidoModel = new PedidoModel();
  // tipo del producto 
  tipoProducto: string = 'Pizzas';
  // lista de productos segun tipoProducto
  productos: any;
  // ordenes de nuestro pedido, esta en el formulario
  ordenes: any = [];
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

  constructor( private node: NodeService, private router: Router ) { }

  ngOnInit() {
    this.pedirProductos(this.tipoProducto);
  }
  
  pedirProductos(tipo: string) {
    this.tipoProducto = tipo;
    
    this.node.listarProductosTipo(tipo).subscribe( resp => {
      this.productos = resp;
  
    });
  }

  agregarOrden(index: number) {
    this.ordenes.push(this.productos[index]);
    this.precios.push(this.productos[index].precio);
    this.cuentaTotal();

  }

  quitarOrden(index: number) {
    // console.log(index);
    // this.precioTotal = this.precioTotal - this.ordenes[index].precio;
    this.ordenes.splice(index, 1);
    this.precios.splice(index, 1);
    this.cuentaTotal();
  }

  login(form: NgForm) {
    if (form.invalid) { return ;}
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
        id_producto: o._id,
        descripcion: this.descrip[i],
        cantidad: this.cant[i]
      }
    }

    // console.log(orden);
    this.pedido = {
      ...this.pedido,
      orden: orden,
    }

    this.node.crearPedido(this.pedido).subscribe( resp => {
      console.log(resp);
    });

    console.log(this.pedido);
    this.router.navigateByUrl('/#');
  }
  
  descripcion(index: number, desc: any) {

    this.descrip[index] = desc.value;
    console.log(this.descrip);

  }

  cantidad(index: number, canti: any) {
    this.cant[index] = canti.value;

    this.precios[index] = canti.value * this.ordenes[index].precio;
    this.cuentaTotal();
    // console.log(this.cant);
  }

  cuentaTotal() {
    console.log(this.precios);
    this.precioTotal = 0;
    for (let i = 0; i < this.precios.length; i++) {
      this.precioTotal = this.precioTotal + this.precios[i];
    }
  }

}
