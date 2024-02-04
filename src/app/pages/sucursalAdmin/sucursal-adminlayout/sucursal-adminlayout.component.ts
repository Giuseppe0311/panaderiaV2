import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarsucursalAdminComponent } from '../../../features/sucursalAdmin/components/navbarsucursal-admin/navbarsucursal-admin.component';

@Component({
  selector: 'app-sucursal-adminlayout',
  standalone: true,
  imports: [RouterOutlet,NavbarsucursalAdminComponent],
  templateUrl: './sucursal-adminlayout.component.html',
  styleUrl: './sucursal-adminlayout.component.css'
})
export class SucursalAdminlayoutComponent {

}
