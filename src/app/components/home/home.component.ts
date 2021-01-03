import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';
// import * as io from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {


  constructor( private node: NodeService ) {
  }

  ngOnInit() {
    this.node.socket.emit('join', {employeeID: localStorage.getItem('idEmpleado'), room: localStorage.getItem('sucursalID')}, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

}
