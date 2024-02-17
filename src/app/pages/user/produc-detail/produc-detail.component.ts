import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarthandlerService } from '../../../features/user/services/carthandler.service';
import { NgClass } from '@angular/common';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-produc-detail',
  standalone: true,
  imports: [NgClass],
  templateUrl: './produc-detail.component.html',
  styleUrl: './produc-detail.component.css'
})
export class ProducDetailComponent  implements OnInit {
  private route = inject(ActivatedRoute)
  private dataservice= inject(ApiServiceService)
  cartService= inject(CarthandlerService)
  data : any = {}
  productadded : boolean = false
  auxquenatity:number=0
  quantiy: number = 1;
  idproducto : number=0
  globalcolor ='red'
  idsucursal : number=0

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.idsucursal = Number(params.get('idsucursal'));
    })
    // Acceder al propio parámetro
    this.route.paramMap.subscribe(params => {
      this.idproducto = Number(params.get('idproducto'));
    });
        this.dataservice.getData(ApiType.Public,'productos',{"idsucursal":this.idsucursal,"idproducto":this.idproducto}).subscribe(
          data => {
            console.log(data)
            this.data=data
          }
        )
      }
  disminuir(){
    if (this.quantiy>1) {
      this.quantiy--
      this.productadded=false
    }

  }
  aumentar(){
    if (this.quantiy < this.data.stock) {
      this.quantiy++;
      this.productadded = false;
    }
  }

  addCart(){
     // Calcula la cantidad total que se intenta añadir al carrito para este producto
  const cantidadTotalIntentandoAñadir = this.auxquenatity + this.quantiy;

  // Verifica si la cantidad total intentando añadir no excede el stock disponible
  if (cantidadTotalIntentandoAñadir <= this.data.stock) {
    // Si no excede, procede a añadir al carrito
    this.productadded = true;
    this.auxquenatity = cantidadTotalIntentandoAñadir; // Actualiza la cantidad auxiliar con el total intentando añadir
    this.cartService.addItem(this.data, this.quantiy, this.data.stock);
  } else {
    // Aquí puedes implementar alguna notificación al usuario, por ejemplo, usando un modal, un toast o un mensaje en la página.
    this.productadded = false; // Considera si esta línea es necesaria según tu lógica de UI
  }
  }

}
