import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FechaPedidoComponent } from './components/pedidos/fecha-pedido/fecha-pedido.component';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';
import {EstadisticasComponent} from './components/estadisticas/estadisticas.component';
import {PedidosCocinaComponent} from './components/pedidos/pedidos-cocina/pedidos-cocina.component';

export const ROUTES: Routes = [
    { path: 'login', component: LoginComponent },

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'fecha-pedidos', component: FechaPedidoComponent },
            { path: 'crear-pedido', component: CrearPedidoComponent },
            { path: 'estadisticas', component: EstadisticasComponent },
            { path: 'cocina', component: PedidosCocinaComponent },

            { path: '', pathMatch: 'full', redirectTo: 'fecha-pedidos' },
            { path: '**', pathMatch: 'full', redirectTo: 'fecha-pedidos' }
        ]
    },

    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];
