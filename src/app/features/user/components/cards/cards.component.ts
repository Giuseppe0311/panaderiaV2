import { NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgClass],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() globalcolor! : string
  @Input() product : any = {}
  @Input() idproducto :number = 0
  @Input() idEmpresa : number=0
  @Input() idSucursal : number=0
  private route  = inject(ActivatedRoute)
  private router = inject(Router)

  navegarAdetalleProductos(idproducto:number){
    this.router.navigate([`empresa/${this.idEmpresa}/sucursal/${this.idSucursal}/producto/${idproducto}`])
  }
}
