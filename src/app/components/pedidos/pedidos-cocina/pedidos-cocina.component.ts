import { Component, OnInit } from '@angular/core';
import {NodeService} from '../../../services/node.service';
import * as moment from 'moment';
import 'moment/locale/es';

interface Cocina{
  ID: any;
  Categorias: any;
  Cliente: any;
  Producto: any;
  Descripcion: any;
  Para: any;
  Completado: any;
}

let PEDIDOS_DATA: Cocina[] = [];


@Component({
  selector: 'app-pedidos-cocina',
  templateUrl: './pedidos-cocina.component.html',
  styles: [
  ]
})
export class PedidosCocinaComponent implements OnInit {

  // displayedColumns: string[] = ['Cliente', 'Pedido', ''Para', 'Completado'];
  // dataSource = ELEMENT_DATA;'

  displayedColumns: string[] = [ 'Cliente', 'Producto', 'Descripcion', 'Para', 'Completado'];
  // dataSource = ELEMENT_DATA;
  dataSource = PEDIDOS_DATA;


  context = new (window.AudioContext)();
  pedidos: any = '';
  pageLimit: number = 10;
  pageSkip: number = 0;
  categorias: any = '';

  fechaActualBusqueda: any;
  fechaActualBusquedaFormat: any;


  constructor( private node: NodeService ) { }

  async ngOnInit(){
    // await this.listarCategorias();
    await this.pedirPedidos();

    this.node.socket.on('recibirComanda', async () => {
      this.playSound();
      await this.pedirPedidos();
    });
  }

  async listarCategorias() {
    await this.node.listarCategorias().subscribe(resp => {
      this.categorias = resp;
    });
  }

  playSound(){
    const osc = this.context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 440;

    // asignamos el destino para el sonido
    osc.connect(this.context.destination);
    // iniciamos la nota
    osc.start();
    // detenemos la nota medio segundo despues
    osc.stop(this.context.currentTime + .5);
  }

  async pedirPedidos(){
    const h = new Date();
    const ho = moment(h);
    const hoy = ho.format('YYYY-MM-DD');

    this.fechaActualBusqueda = hoy;
    this.fechaActualBusquedaFormat = ho;

    await this.node.fechaPedidos(hoy, this.pageLimit, this.pageSkip).subscribe((resp) => {
      this.pedidos = resp;
      console.log(resp);
      this.ordenarPedidos(resp);
    });
  }

  ordenarPedidos(pe) {

    let pedido = {};
    const pedidosNuevo = [];

    pe.forEach((p, index) => {
      let producto = '';
      let descripcion = '';
      pedido = {
        ID: p._id,
        Cliente: p.nombre_cliente,
        Para: p.tipo,
        Completado: p.completado
      };
      const categorias = [];
      p.orden.forEach((ord) => {
        producto = producto + '* ' + ord.cantidad + ': ' + ord.producto_id.nombre;
        descripcion = descripcion + '* ' + ord.descripcion;
        categorias.push(ord.producto_id.categoria_id);
      });
      pedido = {
        ...pedido,
        Producto: producto,
        Descripcion: descripcion,
        Categorias: categorias
      };
      pedidosNuevo.push(pedido);
    });
    PEDIDOS_DATA = pedidosNuevo;
    console.log(PEDIDOS_DATA);

    this.dataSource = PEDIDOS_DATA;

    }

    actualizar_pedido(index) {
      const pedido = PEDIDOS_DATA[index];
      console.log(pedido);
      this.node.actualizarPedido(pedido.ID, pedido.Completado).subscribe(async (resp) => {
        await this.pedirPedidos();
      });
    }

    getColor(com) {
      // console.log(categorias);
      switch (com){
        case true:
          return '';
        case false:
          return '#f73378';
      }
    }

  async recibirMensaje(event) {
    // console.log('buscador...', event);
    // this.pedidos = event;
  }

  // pizzas: 5f51986daf3d7403b74f919b
  // alitas: 5f519a31af3d7403b74f91a5
}
