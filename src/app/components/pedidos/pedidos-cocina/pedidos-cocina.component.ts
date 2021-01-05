import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import {NodeService} from '../../../services/node.service';
import * as moment from 'moment';
import { MatButtonModule } from '@angular/material/button';

export interface PedidosCocina {
  id: any;
  Cliente: any;
  Producto: any;
  Descripcion: any;
  Para: any;
  Completado: any;
}

let PEDIDOS_DATA: PedidosCocina[] = [];

export interface PeriodicElement {
  Cliente: string;
  Pedido: string;
  Para: string;
  Completado: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Cliente: 'jose', Pedido: 'esto esto esto esto', Para: 'llevar', Completado: 'false' },
  { Cliente: 'samuel',
    Pedido: 'esto esto esto estohola hola hola hola hola hola holaalkjsdfl;ajsd;lfjasd;f',
    Para: 'llevar',
    Completado: 'true' }
];

@Component({
  selector: 'app-pedidos-cocina',
  templateUrl: './pedidos-cocina.component.html',
  styles: [
  ]
})
export class PedidosCocinaComponent implements OnInit {

  // displayedColumns: string[] = ['Cliente', 'Pedido', 'Para', 'Completado'];
  // dataSource = ELEMENT_DATA;

  displayedColumns: string[] = ['id', 'Cliente', 'Producto', 'Descripcion', 'Para', 'Completado'];
  // dataSource = ELEMENT_DATA;
  dataSource = PEDIDOS_DATA;


  context = new (window.AudioContext)();
  pedidos: any = '';
  pageLimit: number = 10;
  pageSkip: number = 0;
  categorias: any = '';


  constructor( private node: NodeService ) { }

  async ngOnInit(){
    await this.listarCategorias();
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
        id: index,
        Cliente: p.nombre_cliente,
        Para: p.tipo,
        Completado: p.completado
      };
      p.orden.forEach((ord) => {
        producto = producto + '* ' + ord.cantidad + ': ' + ord.producto_id.nombre;
        descripcion = descripcion + '* ' + ord.descripcion;
      });
      pedido = {
        ...pedido,
        Producto: producto,
        Descripcion: descripcion
      };
      pedidosNuevo.push(pedido);
    });
    PEDIDOS_DATA = pedidosNuevo;
    console.log(PEDIDOS_DATA);

    this.dataSource = PEDIDOS_DATA;

    // PEDIDOS_DATA = pedidosNuevo;

    // console.log(PEDIDOS_DATA);
    }

  // pizzas: 5f51986daf3d7403b74f919b
  // alitas: 5f519a31af3d7403b74f91a5
}
