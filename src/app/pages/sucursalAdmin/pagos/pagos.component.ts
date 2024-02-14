import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent {
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
 detalleCOmprasData:any = {};
 informaciondecompra:any[] = [];
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
   this.apiserviceadmin.getData(ApiType.AdminSucursal,'pagos',{idsucursal:this.idsucursal}).subscribe({
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
 console.log(id);
 this.apiserviceadmin.getData(ApiType.AdminSucursal,'compras',{idCompra:id}).subscribe({
   next: (data) => {
     this.detalleCOmprasData = data;
     console.log(data);
   },
   error: (err) => {
     console.error(err);
   },
 });
 this.apiserviceadmin.getData(ApiType.AdminSucursal,'detallecompras',{idCompra:id}).subscribe({
    next: (data) => {
      this.informaciondecompra = data;
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
  XLSX.writeFile(wb, 'ReporteDePagos.xlsx');
}

exportToPDF(): void {
  html2canvas(document.querySelector("#tablaPagos") as HTMLElement).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
    // A4 size page of PDF
    const imgWidth = 29.7;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('ReporteDePagos.pdf');
  });
}

 /* FUNCIONES DE SUBMIT */
}
