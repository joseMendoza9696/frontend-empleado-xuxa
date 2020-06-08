import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { EmpleadoModel } from '../../models/empleado.model';

import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  empleado: EmpleadoModel = new EmpleadoModel();

  constructor( private node: NodeService, private router: Router ) { }

  ngOnInit() {
    const autenticado = this.node.estaAutenticado();
    if (autenticado) {
      this.router.navigateByUrl('/home');
    }
  }

  login( form: NgForm ) {
    if ( form.invalid ) { return ; }

    this.node.login( this.empleado ).subscribe( resp => {
      console.log(resp);
      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err.error.error.message);
    });

  }

}
