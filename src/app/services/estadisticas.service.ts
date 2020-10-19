import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor() { }

  private header = new HttpHeaders();
  private token = localStorage.getItem('tokenEmpleado');
}
