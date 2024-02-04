import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbaradminempresaComponent } from '../../../features/admin/components/navbaradminempresa/navbaradminempresa.component';

@Component({
  selector: 'app-adminempresalayout',
  standalone: true,
  imports: [RouterOutlet,NavbaradminempresaComponent],
  templateUrl: './adminempresalayout.component.html',
  styleUrl: './adminempresalayout.component.css'
})
export class AdminempresalayoutComponent {

}
