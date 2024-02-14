import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import { FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-ventasconcretadas',
  standalone: true,
  imports: [],
  templateUrl: './ventasconcretadas.component.html',
  styleUrl: './ventasconcretadas.component.css'
})
export class VentasconcretadasComponent {
 /* VARIABLES DE RUTAS */
 route = inject(Router);
 router= inject(ActivatedRoute);
 idsucursal: number | null = null;
 /* VARIABLES DE SERVICIOS */
 apiserviceadmin = inject(ApiServiceService); 
 /* VARIABLES DE MODALES */
 showDetalleModal = false;
 
 /* VARIABLES DE DATOS */
 data: any = [];
 detalleventasData: any = [];
 
 /* VARIABLES DE MENSAJES */
 
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
   this.apiserviceadmin.getData(ApiType.AdminSucursal,'ventas',{idSucursal:this.idsucursal,estado:"PAGADO"}).subscribe({
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
 exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'VentasConcretadas.xlsx');
}

exportToPDF(): void {
  html2canvas(document.querySelector("#tablaVentasConcretadas") as HTMLElement).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
    // A4 size page of PDF
    const imgWidth = 29.7;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('VentasConcretadas.pdf');
  });
}
 
}
