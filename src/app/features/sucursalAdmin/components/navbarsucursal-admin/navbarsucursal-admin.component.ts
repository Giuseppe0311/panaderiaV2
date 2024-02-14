import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbarsucursal-admin',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbarsucursal-admin.component.html',
  styleUrl: './navbarsucursal-admin.component.css'
})
export class NavbarsucursalAdminComponent {
    // Propiedad para mantener el ítem activo
    activo: string = '';
  router = inject(Router);
  route = inject(ActivatedRoute);
  todashboard(){
    this.router.navigate(['dashboard'], {relativeTo: this.route});
  }
  tomisproductos(){
    this.router.navigate(['misproductos'], {relativeTo: this.route});
  }
  tomisventas(){
    this.router.navigate(['misventas'], {relativeTo: this.route});
  }
  toventasanuladas(){
    this.router.navigate(['ventasanuladas'], {relativeTo: this.route});
  }
  toventasconcretadas(){
    this.router.navigate(['ventasconcretadas'], {relativeTo: this.route});
  }
  toproveedores(){
    this.router.navigate(['proveedores'], {relativeTo: this.route});
  }
  tocompras(){
    this.router.navigate(['compras'], {relativeTo: this.route});
  }
  tomiscompras(){
    this.router.navigate(['miscompras'], {relativeTo: this.route});
  }
  tomispagos(){
    this.router.navigate(['pagos'], {relativeTo: this.route});
  }

  // Método para actualizar el ítem activo
  setActivo(item: string) {
    this.activo = item;
  }
}
