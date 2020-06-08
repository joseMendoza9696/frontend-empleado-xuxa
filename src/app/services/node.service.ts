import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { EmpleadoModel } from '../models/empleado.model';
import { PedidoModel } from '../models/pedido.model';

import { map } from 'rxjs/operators';

import * as moment from 'moment';
import 'moment/locale/es';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  userToken: string;
  userId: string;
  userCargo: string;
  userCorreo: string;
  userNombre: string;

  constructor( private http: HttpClient ) { }

  readonly URL: string = 'http://localhost:3000';
  private header = new HttpHeaders();

  private token = localStorage.getItem('token');
  private id = localStorage.getItem('id');
  private cargo = localStorage.getItem('cargo');
  private correo = localStorage.getItem('correo');
  private nombre = localStorage.getItem('nombre');

  login( empleado: EmpleadoModel ) {
    const loginData = {
      ...empleado
    }

    console.log(loginData);

    return this.http.post( `${this.URL}/emp/login`, loginData ).pipe(
      map( resp => {
        this.guardarToken( resp['token'], resp['empleado']['_id'], resp['empleado']['cargo'], resp['empleado']['correo'], resp['empleado']['nombre'] );
        return resp;
      })
    );
  }

  private guardarToken( token: string, id: string, cargo: string, correo: string, nombre: string ) {
    this.userToken = token;
    this.userId = id;
    this.userCargo = cargo;
    this.userCorreo = correo;
    this.userNombre = nombre;
    

    localStorage.setItem( 'token', token );
    localStorage.setItem( 'id', id );
    localStorage.setItem( 'cargo', cargo );
    localStorage.setItem( 'correo', correo );
    localStorage.setItem( 'nombre', nombre );
  }

  estaAutenticado() {
    let token = localStorage.getItem('token');

    if ( !token ) {
      return false
    }
    return true;
  }

  // TODO: PEDIDOS

  fechaPedidos(fecha: any) {
    this.header = this.header.set('Authorization', this.token);
    
    let f = {
      fecha: fecha
    }

    return this.http.post(`${this.URL}/empleado/pedidos/fecha`, f, { headers: this.header } );
  }

  todosPedidos() {
    this.header = this.header.set('Authorization', this.token);
    
    return this.http.get(`${this.URL}/emp/pedidos/${this.id}`,{ headers: this.header });
  }
  
  crearPedido( pedido: PedidoModel ) {
    this.header = this.header.set('Authorization', this.token);
    
    const pedidoData = {
      ...pedido
    }
    
    return this.http.post(`${this.URL}/emp/pedido/nuevo`, pedidoData, { headers: this.header } );
  }
  
  actualizarPedido(idP: string) {
    this.header = this.header.set('Authorization', this.token);
    const patch = {
      estado: true
    }

    return this.http.patch(`${this.URL}/emp/pedido/${idP}/${this.id}`, patch, { headers: this.header });

  }
  
  listarProductos() {
    this.header = this.header.set('Authorization', this.token);
    
    return this.http.get(`${this.URL}/emp/productos`,{ headers: this.header });
  }
  
  listarProducto(id: string) {
    this.header = this.header.set('Authorization', this.token);
    
    return this.http.get(`${this.URL}/emp/producto/${id}`, { headers: this.header });
  }
  
  listarProductosTipo(tipo: string) {
    this.header = this.header.set('Authorization', this.token);
    
    return this.http.get(`${this.URL}/emp/productos/${tipo}`, { headers: this.header });
  }

}
