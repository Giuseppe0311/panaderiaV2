import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';

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
