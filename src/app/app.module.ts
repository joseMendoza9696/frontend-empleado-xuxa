import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ROUTES } from './app.routes';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';
import { FechaPedidoComponent } from './components/pedidos/fecha-pedido/fecha-pedido.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CrearPedidoComponent,
    FechaPedidoComponent,
    NavbarComponent,
    EstadisticasComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot( ROUTES, { useHash: true } )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
