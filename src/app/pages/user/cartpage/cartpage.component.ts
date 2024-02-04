import { Component, OnInit, inject } from '@angular/core';
import { CarthandlerService } from '../../../features/user/services/carthandler.service';

@Component({
  selector: 'app-cartpage',
  standalone: true,
  imports: [],
  templateUrl: './cartpage.component.html',
  styleUrl: './cartpage.component.css'
})
export class CartpageComponent implements OnInit {
  precioenvio?:string
  auxiliar?:number;
 total?:string
  cartitems! : any[]
  carService= inject(CarthandlerService)

  ngOnInit(): void {
    this.items
  }
  get items():any{
    return this.cartitems = this.carService.getItems()
   }
   get subtotal(): number {
     return this.cartitems.reduce((subtotal, item) => {
       const precio = parseFloat(item.product.precioLocal);
       const value = subtotal + precio * item.quantity;
       return value
     }, 0); 
   }
    incrementar(id:number){
      this.cartitems.find(item=>{
        if(item.product.productos.id==id){
          this.carService.addItem(item.product,1)
        }
      })
    }
   decrementar(id:number){
    this.cartitems.find(item=>{
      if(item.product.productos.id==id){
        if(item.quantity>1){
          this.carService.addItem(item.product,-1)
        }
      }
    })
   }
   deleteproduct(idproducto:number){
    this.carService.deleteItem(idproducto)
   }
}
