import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ventasanuladas',
  standalone: true,
  imports: [],
  templateUrl: './ventasanuladas.component.html',
  styleUrl: './ventasanuladas.component.css'
})
export class VentasanuladasComponent {
  /* VARIABLES DE RUTAS */
  route = inject(Router);
  router= inject(ActivatedRoute);
  idsucursal: number | null = null;
  /* VARIABLES DE SERVICIOS */
  apiserviceadmin = inject(ApiServiceService);
  
  
  /* VARIABLES DE MODALES */
  showDetalleModal = false;
  idAEliminar: number | null = null;
  
  /* VARIABLES DE DATOS */
  data: any = [];
  detalleventasData: any = [];
  editdata: any = [];
  
  /* VARIABLES DE CARGA */
  isLoading: boolean = false; // Para mostrar un spinner mientras se cargan los datos
  
  /* FUNCIONES DE CICLO DE VIDA */
  ngOnInit(): void {
    // OBTENER EL ID DE LA EMPRESA
    this.router.parent?.params.subscribe((params) => {
      this.idsucursal = Number(params['idsucursal']);
      console.log(this.idsucursal);
    });
    if (this.idsucursal !== null) {
      this.loadData();
    }
  }
  /* FUNCIONES DE CARGA DE DATOS */
  loadData() {
    this.apiserviceadmin.getData(ApiType.AdminSucursal,'ventas',{idSucursal:this.idsucursal,estado:"ANULADO"}).subscribe({
      next: (data) => {
        this.data = data;
        console.log(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  
  /* FUNCIONES DE MODALES */
  shoModaltDetalle(id: number){
  this.showDetalleModal = true;
  this.apiserviceadmin.getData(ApiType.AdminSucursal,'detalleventas',{idVenta:id}).subscribe({
    next: (data) => {
      this.detalleventasData = data;
      console.log(data);
    },
    error: (err) => {
      console.error(err);
    },
  });
  }
  closemodaldetalle(){
    this.showDetalleModal = false;
  }
  

  /* FUNCIONES DE SUBMIT */
  
}
