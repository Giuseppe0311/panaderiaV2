import { Injectable } from '@angular/core';

interface CartItem{
  product : any,
  quantity : number
}

@Injectable({
  providedIn: 'root'
})

export class CarthandlerService {
  private items : CartItem[] = []
  getItems(){
    return this.items
  }
  addItem(product:any,quantity:number){
    const existingItem = this.items.find(item => item.product.productos.id === product.productos.id);
    if (existingItem) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no está, agrega el producto al carrito
      this.items.push({ product, quantity });
    }
  }
  deleteItem(idproducto: number){
   const index=this.items.findIndex(index=>index.product.productos.id===idproducto)
   if(index !==-1){
      this.items.splice(index,1)
   }
  }
  getCartQuantity (){
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
}
