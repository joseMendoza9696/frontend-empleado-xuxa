import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NodeService } from '../services/node.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private node: NodeService, private router: Router ) {}
  
  canActivate(): boolean {
    
    if ( this.node.estaAutenticado() ) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }

  }

}
