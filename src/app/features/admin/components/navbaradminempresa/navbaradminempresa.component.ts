import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { ApiServiceService, ApiType } from '../../../../core/services/api-service.service';

@Component({
  selector: 'app-navbaradminempresa',
  standalone: true,
  imports: [],
  templateUrl: './navbaradminempresa.component.html',
  styleUrl: './navbaradminempresa.component.css'
})
export class NavbaradminempresaComponent implements OnInit {
  usuario : string ='';
  isLogged = false;
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiservice = inject(ApiServiceService)
  data : any ={}
  ngOnInit(): void {
    this.route.url.subscribe(() => {
      // Aquí, en lugar de suscribirse a 'url', que solo te dará los segmentos de la URL del componente actual,
      // podrías querer suscribirte a 'params' o 'paramMap' para obtener los parámetros de la ruta.
      this.route.paramMap.subscribe(params => {
        let idempresa = Number(params.get('idempresa')); // Obtiene el valor de 'idempresa'
        this.apiservice.getData(ApiType.Public,'empresas',{"idempresa":idempresa}).subscribe(data=>{
          console.log(data)
          this.data= data
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
  private authservice = inject(AuthService);
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
  tousuariosucursal(){
    this.router.navigate(['usuariosucursal'], {relativeTo: this.route});
  }
  cerrarSesion(){
    this.authservice.logout()
    this.isLogged = false
    this.router.navigate(['/']);
  }
}
