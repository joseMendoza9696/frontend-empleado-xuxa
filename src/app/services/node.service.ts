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
  pedidosBusqueda: any;
  constructor( private http: HttpClient  ) { }

  // readonly URL: string = 'http://localhost:3000';
  readonly URL: string = 'https://men-xuxas-backend.herokuapp.com';
  private header = new HttpHeaders();

  readonly WeatherURL: string = 'https://api.openweathermap.org/data/2.5/weather?';
  private apiKey: string = '3ea95b323ca21f1399996784116faef2';
  private city: string = 'Riberalta';
  private units: string = 'metric';

  private token = localStorage.getItem('tokenEmpleado');
  private id = localStorage.getItem('idEmpleado');
  private correo = localStorage.getItem('correoEmpleado');
  private nombre = localStorage.getItem('nombreEmpleado');
  private sucursal = localStorage.getItem('sucursalID');

  login( empleado: EmpleadoModel ) {
    const loginData = {
      ...empleado
    }

    console.log(loginData);

    return this.http.post( `${this.URL}/emp/login`, loginData ).pipe(
      map( resp => {
        this.guardarToken( resp['token'], resp['empleado']['_id'], resp['empleado']['correo'], resp['empleado']['nombre'], resp['empleado']['sucursal_id'] );
        return resp;
      })
    );
  }

  private guardarToken( token: string, id: string, correo: string, nombre: string, sucursal: string ) {
    this.userToken = token;
    this.userId = id;
    this.userCorreo = correo;
    this.userNombre = nombre;


    localStorage.setItem( 'tokenEmpleado', token );
    localStorage.setItem( 'idEmpleado', id );
    localStorage.setItem( 'correoEmpleado', correo );
    localStorage.setItem( 'nombreEmpleado', nombre );
    localStorage.setItem('sucursalID', sucursal);
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

    return this.http.get(`${this.URL}/pedidosFecha?fecha=${fecha}&limit=${limit}&skip=${skip}&sucursal=${this.sucursal}`, { headers: this.header } );
  }

  ingresoTotal(fecha: any) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/pedidosFechaPrecio?fecha=${fecha}&sucursal=${this.sucursal}`, { headers: this.header });
  }

  todosPedidos() {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/emp/pedidos/${this.id}`, { headers: this.header });
  }

  crearPedido( pedido: PedidoModel ) {
    this.header = this.header.set('Authorization', this.token);

    const body = {
      ...pedido,
      sucursal_id: this.sucursal
    }

    return this.http.post(`${this.URL}/crearPedido`, body, { headers: this.header } );
  }

  actualizarPedido(idP: string) {
    this.header = this.header.set('Authorization', this.token);
    const patch = {
      estado: true
    };

    return this.http.patch(`${this.URL}/emp/pedido/${idP}/${this.id}`, patch, { headers: this.header });
  }

  buscarPedidoNombre(fecha: string, nombre: string) {
    this.header = this.header.set('Authorization', this.token);

    return this.http.get(`${this.URL}/buscarCliente?nombre=${nombre}&fecha=${fecha}`, { headers: this.header });
  }

  public pedidosPorBusqueda( pedidos: any ) {
    this.pedidosBusqueda = pedidos;
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

  consultarClima() {
    return this.http.get(`${this.WeatherURL}q=${this.city}&appid=${this.apiKey}&lang=es&units=${this.units}`);
  }

  logout() {
    this.header = this.header.set('Authorization', this.token);

    return this.http.post( `${this.URL}/emp/logout`, {  }, { headers: this.header });
  }

}
