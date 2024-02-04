import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbarsucursal-admin',
  standalone: true,
  imports: [],
  templateUrl: './navbarsucursal-admin.component.html',
  styleUrl: './navbarsucursal-admin.component.css'
})
export class NavbarsucursalAdminComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  tomisproductos(){
    this.router.navigate(['misproductos'], {relativeTo: this.route});
  }
}
