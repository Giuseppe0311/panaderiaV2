import { Component, OnInit, inject } from '@angular/core';
import {
  ApiServiceService,
  ApiType,
} from '../../../core/services/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { DataSharingService } from '../../shared/data-sharing.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-misventas',
  standalone: true,
  imports: [],
  templateUrl: './misventas.component.html',
  styleUrl: './misventas.component.css',
})
export class MisventasComponent implements OnInit {
  /* VARIABLES DE RUTAS */
  route = inject(Router);
  router = inject(ActivatedRoute);
  datasharing = inject(DataSharingService);
  idsucursal: number | null = null;
  idempresa: number | null = null;
  /* VARIABLES DE SERVICIOS */
  apiserviceadmin = inject(ApiServiceService);

  /* VARIABLES DE FORMULARIO */
  formulario: FormGroup;
  updateform: FormGroup;

  /* VARIABLES DE MODALES */
  showDetalleModal = false;
  showmodalConcretarVenta = false;
  showEliminarModal = false;
  idAEliminar: number | null = null;
  idAConcretar: number | null = null;

  /* VARIABLES DE DATOS */
  data: any[] = [];
  detalleventasData: any[] = [];
  editdata: any[] = [];

  /* VARIABLES DE MENSAJES */
  showsuccess = false;
  showerror = false;
  showsuccessupdate = false;
  showerrorupdate = false;

  /* VARIABLES DE CARGA */
  isLoading: boolean = false; // Para mostrar un spinner mientras se cargan los datos

  /* VARIABLES DE PDF */
  fecha: any;
  num_comprobante: any;
  tipo_comprobante: any;
  tipo_pago: any;
  usuario: any;
  nombre_sucursal: any;
  total: any;
  datoProductospdf: any = [];

  /* CONSTRUCTOR */
  constructor(private formbuild: FormBuilder) {
    this.formulario = this.formbuild.group({
      producto: ['', Validators.required],
      //valida que maximo tenga 4 dijitos
      preciolocal: [
        '',
        [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')],
      ],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
    });
    this.updateform = this.formbuild.group({
      producto: ['', Validators.required],
      preciolocal: [
        '',
        [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')],
      ],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
      id: [''],
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
      this.idempresa = Number(params['idempresa']);
      console.log(this.idsucursal);
    });
    if (this.idsucursal !== null) {
      this.loadData();
    }
  }
  /* FUNCIONES DE CARGA DE DATOS */
  loadData() {
    this.apiserviceadmin
      .getData(ApiType.AdminSucursal, 'ventas', {
        idSucursal: this.idsucursal,
        estado: 'RESERVADO',
      })
      .subscribe({
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
  shoModaltDetalle(id: number) {
    this.showDetalleModal = true;
    this.apiserviceadmin
      .getData(ApiType.AdminSucursal, 'detalleventas', { idVenta: id })
      .subscribe({
        next: (data) => {
          this.detalleventasData = data;
          console.log(data);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  closemodaldetalle() {
    this.showDetalleModal = false;
  }

  showModalConcretarVenta(id: number) {
    if (id !== null) {
      this.showmodalConcretarVenta = true;
      this.idAConcretar = id;
    } else {
      alert(
        'No se puede concretar la venta hubo un error al obtener el id de la venta'
      );
    }
  }
  closeModalConcretar() {
    this.showmodalConcretarVenta = false;
  }

  showModalEliminar(id: number) {
    if (id !== null) {
      this.showEliminarModal = true;
      this.idAEliminar = id;
    } else {
      alert(
        'No se puede eliminar el producto hubo un error al obtener el id del producto'
      );
    }
  }
  closemodalEliminar() {
    this.showEliminarModal = false;
    this.idAEliminar = null;
    this.isLoading = false;
  }
  /* FUNCIONES DE SUBMIT */

  eliminar() {
    if (this.idAEliminar !== null) {
      this.isLoading = true;
      this.apiserviceadmin
        .deleteData(ApiType.AdminSucursal, 'ventas', this.idAEliminar)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.loadData();
            this.closemodalEliminar();
            this.isLoading = false;
            //reload page
          },
          (err: any) => {
            this.isLoading = false;
            alert('Error al eliminar el producto de la sucursal' + err);
          }
        );
    } else {
      alert(
        'No se puede eliminar el producto de la sucursal hubo un error al obtener el id del producto'
      );
    }
  }
  concretarVenta() {
    if (this.idAConcretar !== null) {
      this.isLoading = true;
      console.log(this.idAConcretar);
      this.apiserviceadmin
        .getData(ApiType.AdminSucursal, 'ventas', {
          idVenta: this.idAConcretar,
          estado: 'RESERVADO',
        })
        .subscribe({
          next: (data) => {
            // Asignación de datos recibidos a variables del componente
            this.fecha = data.fecha;
            console.log(data.fecha); // Verificación en consola
            this.num_comprobante = data.numComprobante;
            this.tipo_comprobante = data.tipoComprobante;
            this.tipo_pago = data.tipoPago;
            this.usuario = data.nombreUsuario;
            this.nombre_sucursal = data.nombreSucursal;
            this.total = data.total;
            this.apiserviceadmin
              .getData(ApiType.AdminSucursal, 'detalleventas', {
                idVenta: this.idAConcretar,
              })
              .subscribe({
                next: (data) => {
                  this.datoProductospdf = data;
                  const datosParaPdf = {
                    fecha: this.fecha,
                    num_comprobante: this.num_comprobante,
                    tipo_comprobante: this.tipo_comprobante,
                    tipo_pago: this.tipo_pago,
                    usuario: this.usuario,
                    nombre_sucursal: this.nombre_sucursal,
                    total: this.total,
                    detalleVentas: this.datoProductospdf, // Asegúrate de que esto contenga la respuesta con los detalles de la venta
                  };
                  this.datasharing.updateVentaData(datosParaPdf);
                },
                error: (err) => {
                  console.error(err);
                  this.isLoading = false;
                },
              });
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          },
        });
        this.apiserviceadmin.updateData(ApiType.AdminSucursal,'ventas',this.idAConcretar,{}).subscribe(
          (res: any) => {
            console.log(res);     
            this.isLoading = false;
            this.loadData();
            const rutaCompleta = `/empresa/${this.idempresa}/sucursal/${this.idsucursal}/admin/generar-pdf`;
            this.route.navigate([rutaCompleta]);
            this.closeModalConcretar();
            //reload page
          },
          (err: any) => {
            this.isLoading = false;
            alert('Error al eliminar el producto de la sucursal' + err);
          }
        );
    } else {
      alert(
        'No se puede concretar la venta hubo un error al obtener el id de la venta'
      );
    }
  }
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ventasPendientes.xlsx');
  }
  
  exportToPDF(): void {
    html2canvas(document.querySelector("#tablaventasPendientes") as HTMLElement).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
      // A4 size page of PDF
      const imgWidth = 29.7;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('ventasPendientes.pdf');
    });
  }
  

  // generarPDF() {
  //   const data = document.getElementById('boletapago');
  //   if (data) {
  //     // Hacer el elemento temporalmente visible para la captura
  //     data.style.visibility = 'visible';
  //     data.style.position = 'absolute';
  //     data.style.left = '0';
  //     data.style.top = '0';

  //     html2canvas(data).then(canvas => {
  //       const imgWidth = 208; // Ancho de A4 en mm
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       let pdf = new jsPDF('p', 'mm', 'a4');
  //       pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
  //       pdf.save('comprobante.pdf');

  //       // Restaurar el estilo original después de la captura
  //       data.style.visibility = 'hidden';
  //       data.style.position = 'absolute';
  //       data.style.left = '-10000px';
  //       data.style.top = 'auto';
  //     });
  //   }
  // }
}
