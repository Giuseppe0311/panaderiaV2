import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '../../../features/user/services/user-api.service';
import { CarthandlerService } from '../../../features/user/services/carthandler.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-produc-detail',
  standalone: true,
  imports: [NgClass],
  templateUrl: './produc-detail.component.html',
  styleUrl: './produc-detail.component.css'
})
export class ProducDetailComponent  implements OnInit {
  private route = inject(ActivatedRoute)
  private dataservice= inject(UserApiService)
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
        this.dataservice.getData('productos',{"idsucursal":this.idsucursal,"idproducto":this.idproducto}).subscribe(
          data => {
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
    this.quantiy++
    this.productadded=false
  }

  addCart(){
    this.productadded=true
    this.auxquenatity=this.auxquenatity+this.quantiy
    this.cartService.addItem(this.data,this.quantiy)
  }

}
