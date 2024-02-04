import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardsComponent } from '../cards/cards.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgClass,CardsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  globalcolor = 'green'
  selectedFilter = 'low'
 @Input() products : any[] = []
 @Input() idsucursal : number = 0
  @Input() idempresa : number  = 0

}
