import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { ApiServiceService, ApiType } from '../../../../core/services/api-service.service';

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
  private apiservice = inject(ApiServiceService)
  logo :string = ''
  nombreEmpresa: string = ''
  nombreSucursal: string = ''
  ngOnInit(): void {
    this.route.url.subscribe(() => {
      // Aquí, en lugar de suscribirse a 'url', que solo te dará los segmentos de la URL del componente actual,
      // podrías querer suscribirte a 'params' o 'paramMap' para obtener los parámetros de la ruta.
      this.route.paramMap.subscribe(params => {
        let idempresa = Number(params.get('idempresa')); // Obtiene el valor de 'idempresa'
        let idsucursal = Number(params.get('idsucursal')); // Obtiene el valor de 'idsucursal'
        this.apiservice.getData(ApiType.Public,'empresas',{"idempresa":idempresa}).subscribe(data=>{
          console.log(data)
          this.logo= data.logo
          this.nombreEmpresa = data.nombre
        });
        this.apiservice.getData(ApiType.Public,'sucursales',{"idsucursal":idsucursal}).subscribe(data=>{
          console.log(data)
          this.nombreSucursal = data.nombre
        });
      });
    });
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
