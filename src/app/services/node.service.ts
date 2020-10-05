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
  userCorreo: string;
  userNombre: string;

  constructor( private http: HttpClient ) { }

  readonly URL: string = 'http://localhost:3000';
  // readonly URL: string = 'https://men-xuxas-backend.herokuapp.com';
  private header = new HttpHeaders();

  private token = localStorage.getItem('tokenEmpleado');
  private id = localStorage.getItem('idEmpleado');
  private correo = localStorage.getItem('correoEmpleado');
  private nombre = localStorage.getItem('nombreEmpleado');

  login( empleado: EmpleadoModel ) {
    const loginData = {
      ...empleado
    }

    console.log(loginData);

    return this.http.post( `${this.URL}/emp/login`, loginData ).pipe(
      map( resp => {
        this.guardarToken( resp['token'], resp['empleado']['_id'], resp['empleado']['correo'], resp['empleado']['nombre'] );
        return resp;
      })
    );
  }

  private guardarToken( token: string, id: string, correo: string, nombre: string ) {
    this.userToken = token;
    this.userId = id;
    this.userCorreo = correo;
    this.userNombre = nombre;


    localStorage.setItem( 'tokenEmpleado', token );
    localStorage.setItem( 'idEmpleado', id );
    localStorage.setItem( 'correoEmpleado', correo );
    localStorage.setItem( 'nombreEmpleado', nombre );
  }

  estaAutenticado() {
    let token = localStorage.getItem('tokenEmpleado');

    if ( !token ) {
      return false
    }
    return true;
  }

  // TODO: PEDIDOS

  fechaPedidos(fecha: any, limit: number, skip: number) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/pedidosFecha?fecha=${fecha}&limit=${limit}&skip=${skip}`, { headers: this.header } );
  }

  ingresoTotal(fecha: any) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/pedidosFechaPrecio?fecha=${fecha}`, { headers: this.header });
  }

  todosPedidos() {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/emp/pedidos/${this.id}`, { headers: this.header });
  }

  crearPedido( pedido: PedidoModel ) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.post(`${this.URL}/crearPedido`, pedido, { headers: this.header } );
  }

  actualizarPedido(idP: string) {
    this.header = this.header.set('Authorization', this.token);
    const patch = {
      estado: true
    };

    return this.http.patch(`${this.URL}/emp/pedido/${idP}/${this.id}`, patch, { headers: this.header });

  }

  listarProductos() {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/emp/productos`,{ headers: this.header });
  }

  listarProducto(id: string) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/producto/${id}`, { headers: this.header });
  }

  listarProductosCategoria(categoria: string) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/listar-producto?categoria=${categoria}`, { headers: this.header });
  }

  listarCategorias() {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/listar-categorias`, { headers: this.header });
  }

}
