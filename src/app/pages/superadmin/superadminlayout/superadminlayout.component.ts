import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarsuperadminComponent } from '../../../features/superadmin/components/navbarsuperadmin/navbarsuperadmin.component';

@Component({
  selector: 'app-superadminlayout',
  standalone: true,
  imports: [RouterOutlet,NavbarsuperadminComponent],
  templateUrl: './superadminlayout.component.html',
  styleUrl: './superadminlayout.component.css'
})
export class SuperadminlayoutComponent {

}
