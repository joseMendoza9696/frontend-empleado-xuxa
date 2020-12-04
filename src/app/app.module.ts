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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

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

    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,

    HttpClientModule,
    FormsModule,
    RouterModule.forRoot( ROUTES, { useHash: true } ),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
