import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-navbarsucursal-admin',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbarsucursal-admin.component.html',
  styleUrl: './navbarsucursal-admin.component.css'
})
export class NavbarsucursalAdminComponent implements OnInit {
    // Propiedad para mantener el ítem activo
    isLogged = false;
    usuario : string ='';
    activo: string = '';
  router = inject(Router);
  route = inject(ActivatedRoute);
  private authservice = inject(AuthService);
  ngOnInit(): void {
    this.authservice.currentUserLoginOn.subscribe(data => {
      if(data){
        console.log(data)
        this.isLogged = true
        this.authservice.currentUserData.subscribe(data => {
          console.log(data)
          if(data){
            this.usuario = data.sub
          }
        })
      }
    })
  }
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
  cerrarSesion(){
    this.authservice.logout()
    this.isLogged = false
    this.router.navigate(['/']);
  }
}
