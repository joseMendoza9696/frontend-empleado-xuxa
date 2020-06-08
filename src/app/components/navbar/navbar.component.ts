import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {

  constructor() { }

  nombre = localStorage.getItem('nombre');
  cargo = localStorage.getItem('cargo');

  ngOnInit() {
  }

}
