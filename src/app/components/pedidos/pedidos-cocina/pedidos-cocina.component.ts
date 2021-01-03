import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import {NodeService} from '../../../services/node.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pedidos-cocina',
  templateUrl: './pedidos-cocina.component.html',
  styles: [
  ]
})
export class PedidosCocinaComponent implements OnInit {

  context = new (window.AudioContext)();
  pedidos: any = '';
  pageLimit: number = 10;
  pageSkip: number = 0;

  constructor( private node: NodeService ) {
  }

  async ngOnInit(){
    const h = new Date();
    const ho = moment(h);
    const hoy = ho.format('YYYY-MM-DD');
    this.node.socket.on('recibirComanda', async () => {
      this.playSound();
      // TODO crear otra ruta para los pedidos en cocina
      await this.node.fechaPedidos(hoy, this.pageLimit, this.pageSkip).subscribe((resp) => {
        this.pedidos = resp;
        console.log(resp);
      });
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

}
