import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarthandlerService } from '../../services/carthandler.service';
import { ApiServiceService, ApiType } from '../../../../core/services/api-service.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  linkColor = 'green';
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private authservice = inject(AuthService)

  idempresa : number = 0
  idsucursal : number=0
  isLogged = false
  data : any[] = []
  usuario : string =''
  dataservice = inject(ApiServiceService)
  carService = inject(CarthandlerService);
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
    this.subscribeToRouteChanges();
      this.dataservice.getData(ApiType.Public,'categorias',{"idempresa":this.idempresa}).subscribe(data=>{
      this.data= data
      })
  }

  private subscribeToRouteChanges(): void {
    this.route.url.subscribe(() => {
      // Aquí, en lugar de suscribirse a 'url', que solo te dará los segmentos de la URL del componente actual,
      // podrías querer suscribirte a 'params' o 'paramMap' para obtener los parámetros de la ruta.
      this.route.paramMap.subscribe(params => {
        this.idempresa = Number(params.get('idempresa')); // Obtiene el valor de 'idempresa'
        this.idsucursal = Number(params.get('idsucursal')); // Obtiene el valor de 'idsucursal'
      });
    });
  }
  get cartQuantity(): number {
    return this.carService.getCartQuantity();
  }

  categoriaseleccionada(idcat: number) {
    if(idcat!=0){
      this.router.navigate([`categoria/${idcat}`], { relativeTo: this.route });
    }else {
      this.router.navigate(['/empresa', this.idempresa, 'sucursal', this.idsucursal]);
    }
  }
  tocart(){
    this.router.navigate(['/empresa', this.idempresa, 'sucursal', this.idsucursal,'cart']);
  }
  cerrarSession(){
    this.authservice.logout()
    this.isLogged = false
  }
}
