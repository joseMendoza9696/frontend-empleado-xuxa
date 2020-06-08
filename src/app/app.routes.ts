import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FechaPedidoComponent } from './components/pedidos/fecha-pedido/fecha-pedido.component';
import { TodosPedidoComponent } from './components/pedidos/todos-pedido/todos-pedido.component';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';

export const ROUTES: Routes = [
    { path: 'login', component: LoginComponent },

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'fecha-pedidos', component: FechaPedidoComponent },
            { path: 'pedidos', component: TodosPedidoComponent },
            { path: 'crear-pedido', component: CrearPedidoComponent },

            { path: '', pathMatch: 'full', redirectTo: 'fecha-pedidos' },
            { path: '**', pathMatch: 'full', redirectTo: 'fecha-pedidos' }
        ]
    },

    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];