import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-miscompras',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './miscompras.component.html',
  styleUrl: './miscompras.component.css'
})
export class MiscomprasComponent {
  /* VARIABLES DE RUTAS */
  route = inject(Router);
  router= inject(ActivatedRoute);
  idsucursal: number | null = null;
  /* VARIABLES DE SERVICIOS */
  apiserviceadmin = inject(ApiServiceService);
  
  /* VARIABLES DE FORMULARIO */
  formulario: FormGroup;
  
  /* VARIABLES DE MODALES */
  showDetallecomprasModal = false;
  showPagarmodal = false;
  showEliminarModal = false;
  idAEliminar: number | null = null;
  idApagar: number | null = null;
  
  /* VARIABLES DE DATOS */
  data: any[] = [];
  detalleData: any[] = [];
  
  /* VARIABLES DE MENSAJES */
  showsuccess = false;
  showerror = false;
  showsuccessupdate = false;
  showerrorupdate = false;
  
  /* VARIABLES DE CARGA */
  isLoading: boolean = false; // Para mostrar un spinner mientras se cargan los datos
  
  /* CONSTRUCTOR */
  constructor(private formbuild : FormBuilder) {
    this.formulario = this.formbuild.group({
      tipopago: ['', Validators.required],
      //QUE VALIDE QUE SEA NUMERO Y 2 DECIMALES
      montopago: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      fechapago: ['', Validators.required],
    });
  }
  /* FUNCIONES DE VALIDACION */
  hasErrors(formgroup: FormGroup, controlName: string, errorType: string) {
    return (
      formgroup.get(controlName)?.hasError(errorType) &&
      formgroup.get(controlName)?.touched
    );
  }
  
  /* FUNCIONES DE CICLO DE VIDA */
  ngOnInit(): void {
    // OBTENER EL ID DE LA EMPRESA
    this.router.parent?.params.subscribe((params) => {
      this.idsucursal = Number(params['idsucursal']);
  
    });
    if (this.idsucursal !== null) {
      this.loadData();
    }
  }
  /* FUNCIONES DE CARGA DE DATOS */
  loadData() {
    this.apiserviceadmin.getData(ApiType.AdminSucursal,'compras',{idSucursal:this.idsucursal}).subscribe({
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
  showModalDetallesCompra(id: number) {
    console.log(id);
    this.showDetallecomprasModal = true;
    this.apiserviceadmin.getData(ApiType.AdminSucursal,'detallecompras',{idCompra:id}).subscribe({
      next: (data) => {
        this.detalleData = data;
        console.log(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  closemodalDetalleCompra() {
    this.showDetallecomprasModal = false;
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
  }
  ShowModalPagar(id: number) {
    this.idApagar = id;
    this.showPagarmodal = true;
  }
  closemodalPagar() {
    this.showPagarmodal = false;
    this.formulario.reset();
  }
  showModalEliminar(id: number) {
    if (id !== null){
    this.showEliminarModal = true;
    this.idAEliminar = id;
    }else{
      alert('No se puede eliminar el producto hubo un error al obtener el id del producto');
    }
  }
  closemodalEliminar() {
    this.showEliminarModal = false;
    this.idAEliminar = null;
    this.formulario.reset();
  }
  /* FUNCIONES DE SUBMIT */
  
  pagar() {
    if (this.idApagar!==null && this.formulario.valid) {
      this.isLoading = true;
      const data ={
        idcompra: this.idApagar,
        tipo_pago: this.formulario.value.tipopago,
        monto_pagado: this.formulario.value.montopago,
        fechadepago: this.formulario.value.fechapago,
      }
      this.apiserviceadmin.postData(ApiType.AdminSucursal,'pagos',data).subscribe(
        (res: any) => {
          console.log(res);
          this.closemodalPagar();
          this.isLoading = false;
        },
        (err: any) => {
          this.showerrorupdate = true;
          console.error(err);
          this.isLoading = false;
          alert('Error al pagar la compra'+err);
          return;
        }
      );

      this.apiserviceadmin.updateData(ApiType.AdminSucursal,'compras', this.idApagar, 'PAGADO').subscribe(
        (res: any) => {
          console.log(res);
          this.loadData();
          this.closemodalPagar();
          this.isLoading = false;
        },
        (err: any) => {
          this.showerrorupdate = true;
          this.isLoading = false;
          console.error(err);
          alert('Error al pagar la compra'+err);
          return
        }
      );
      
    }else{
      alert('HUBO UN ERROR AL PAGAR LA COMPRA, REVISE LOS DATOS INGRESADOS');
    }
  
  }
  
  
  
  eliminar() {
    if (this.idAEliminar!==null) {
     this.isLoading = true;
      this.apiserviceadmin.deleteData(ApiType.AdminSucursal,'compras', this.idAEliminar).subscribe(
        (res: any) => {
          console.log(res);
          this.loadData();
          this.closemodalEliminar();
           this.isLoading = false;
          //reload page
        },
        (err: any) => {
          alert('Error al eliminar la compra'+err);
        }
      );
    }else{
      alert('No se pudo eliminar el la compra');
    }
  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ReporteDeCompras.xlsx');
  }
  
  exportToPDF(): void {
    html2canvas(document.querySelector("#tablamiscompras") as HTMLElement).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
      // A4 size page of PDF
      const imgWidth = 29.7;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('ReporteDeCompras.pdf');
    });
  }
}
