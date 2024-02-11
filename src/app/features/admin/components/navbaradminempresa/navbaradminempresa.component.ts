import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbaradminempresa',
  standalone: true,
  imports: [],
  templateUrl: './navbaradminempresa.component.html',
  styleUrl: './navbaradminempresa.component.css'
})
export class NavbaradminempresaComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  toproductos(){
    this.router.navigate(['productos'], {relativeTo: this.route});
  }
  tocategorias(){
    this.router.navigate(['categorias'], {relativeTo: this.route});
  }
  tosucursales(){
    this.router.navigate(['sucursales'], {relativeTo: this.route});
  }
  tounidadesmedida(){
    this.router.navigate(['unidadesmedida'], {relativeTo: this.route});
  }
}
