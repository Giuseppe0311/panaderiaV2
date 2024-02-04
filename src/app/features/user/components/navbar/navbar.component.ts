import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';
import { CarthandlerService } from '../../services/carthandler.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  linkColor = 'green';
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  idempresa : number = 0
  idsucursal : number=0
  data : any[] = []
  dataservice = inject(UserApiService)
  carService = inject(CarthandlerService);
  ngOnInit(): void {
    this.subscribeToRouteChanges();
      this.dataservice.getData('categorias',{"idempresa":this.idempresa}).subscribe(data=>{
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
}
