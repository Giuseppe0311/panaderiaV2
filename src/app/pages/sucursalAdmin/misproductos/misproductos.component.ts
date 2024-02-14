import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-misproductos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './misproductos.component.html',
  styleUrl: './misproductos.component.css'
})
export class MisproductosComponent {
/* VARIABLES DE RUTAS */
route = inject(Router);
router= inject(ActivatedRoute);
idempresa: number | null = null;
idsucursal: number | null = null;
/* VARIABLES DE SERVICIOS */
apiserviceadmin = inject(ApiServiceService);

/* VARIABLES DE FORMULARIO */
formulario: FormGroup;
updateform: FormGroup;

/* VARIABLES DE MODALES */
showregistermodal = false;
showEditModal = false;
showEliminarModal = false;
idAEliminar: number | null = null;
/*VARIABLES DE MENSAJE*/
mensaje: string = '';

/* VARIABLES DE DATOS */
data: any = [];
productosdata: any = [];
editdata: any = [];

/* VARIABLES DE MENSAJES */
showsuccess = false;
showerror = false;
showsuccessupdate = false;
showerrorupdate = false;

/* VARIABLES DE CARGA */
isLoading: boolean = false; // Para mostrar un spinner mientras se cargan los datos

/* CONSTRUCTOR */
constructor(private formbuild: FormBuilder) {
  this.formulario = this.formbuild.group({
    producto: ['', Validators.required],
  //valida que maximo tenga 4 dijitos
  preciolocal: ['', [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
  stock: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],

  });
  this.updateform = this.formbuild.group({
    producto: ['', Validators.required],
    preciolocal: ['', [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
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
    this.idempresa = Number(params['idempresa']);
    this.idsucursal = Number(params['idsucursal']);
    console.log(this.idempresa);
    console.log(this.idsucursal);
  });
  if (this.idempresa !== null && this.idsucursal !== null) {
    this.loadData();
  }
}
/* FUNCIONES DE CARGA DE DATOS */
loadData() {
  this.apiserviceadmin.getData(ApiType.Public,'productos',{idsucursal:this.idsucursal}).subscribe({
    next: (data) => {
      this.data = data;
      console.log(this.data);
    },
    error: (err) => {
      console.error(err);
    },
  });
}
loadProductosfromEmpresa(){
  this.apiserviceadmin.getData(ApiType.Public,'productos',{idempresa:this.idempresa}).subscribe({
    next: (data) => {
      this.productosdata = data;
      console.log(this.productosdata);
    },
    error: (err) => {
      console.error(err);
    },
  });
}

/* FUNCIONES DE MODALES */
showmodalregistrar() {
  this.showregistermodal = !this.showregistermodal;
  this.showsuccess = false;
  this.showerror = false;
  this.formulario.reset();
  this.loadProductosfromEmpresa();
}
showModaleditar(id: number) {
  this.loadProductosfromEmpresa();
  this.showEditModal = true;
  this.apiserviceadmin
    .getData(ApiType.Public,'productos', { idProductoSucursal: id })
    .subscribe((data) => {
      this.editdata = data;
      console.log(this.editdata);
      console.log(this.editdata.productos.id);
      this.updateform.patchValue({
        producto: this.editdata.productos.id,
        preciolocal: this.editdata.precioLocal,
        stock: this.editdata.stock,
        id: this.editdata.idProductoSucursal,
      });
    });
}
closemodaleditar() {
  this.showEditModal = false;
  this.showsuccessupdate = false;
  this.showerrorupdate = false;
  this.updateform.reset();
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
  this.isLoading = false;
}
/* FUNCIONES DE SUBMIT */

registrar() {
  this.showsuccess = false;
  this.showerror = false;
  //send data
  if (this.formulario.valid && this.idempresa !== null && this.idsucursal !== null) {
    this.showsuccess = false;
    this.showerror = false;
    this.isLoading = true;
    //send data type json
   const data = {
    idProducto: this.formulario.value.producto,
    idSucursal: this.idsucursal,
    precioLocal: this.formulario.value.preciolocal,
    stock: this.formulario.value.stock,
   };
   this.apiserviceadmin.postData(ApiType.AdminSucursal,'productosucursal', data).subscribe(
     (res: any) => {
       console.log(res);
         this.isLoading = false;
         this.formulario.reset();
         this.loadData();
         this.showsuccess = true;
     },
     (err: any) => {
       this.showerror = true;
       console.log(err);
       if (err.error.message) {
        this.mensaje = err.error.message;
        
      }else{
        this.mensaje = 'Error en el servidor, intente mas tarde';
      }
       this.isLoading = false;
     }
   );
  }else{
  this.showerror = true;
  this.mensaje = 'Error en el formulario, verifique los campos';
  }
}
actualizar(){
  this.showsuccessupdate = false;
  this.showerrorupdate = false;
  if (this.updateform.valid && this.idempresa !== null && this.idsucursal !== null) {
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
    this.isLoading = true;
     //send data type json
     const data = {
      idProducto: this.updateform.value.producto,
      idSucursal: this.idsucursal,
      precioLocal: this.updateform.value.preciolocal,
      stock: this.updateform.value.stock,
      id: this.updateform.value.id,
     };
     this.apiserviceadmin.updateData(ApiType.AdminSucursal,'productosucursal', this.updateform.value.id, data).subscribe(
       (res: any) => {
         console.log(res);
           this.loadData();
           this.isLoading = false;
           this.showsuccessupdate = true;
       },
       (err: any) => {
         this.showerrorupdate = true;
         console.log(err);
         if (err.error.message) {
          this.mensaje = err.error.message;
          
        }else{
          this.mensaje = 'Error en el servidor, intente mas tarde';
        }
         this.isLoading = false;
       }
     );
  }else{
    this.showerrorupdate = true;
    this.mensaje = 'Error en el formulario, verifique los campos';
  }
}



eliminar() {
  if (this.idAEliminar!==null) {
   this.isLoading = true;
    this.apiserviceadmin.deleteData(ApiType.AdminSucursal,'productosucursal', this.idAEliminar).subscribe(
      (res: any) => {
        console.log(res);
        this.loadData();
        this.closemodalEliminar();
         this.isLoading = false;
        //reload page
      },
      (err: any) => {
        this.isLoading = false;
        alert('Error al eliminar el producto de la sucursal'+err);
      }
    );
  }else{
    alert('No se puede eliminar el producto de la sucursal hubo un error al obtener el id del producto');
  }
}
exportToExcel(): void {
  //para exportar a excel
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'reporteProdcutos.xlsx');
}

exportToPDF(): void {
  html2canvas(document.querySelector("#reportProductos") as HTMLElement).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
    // A4 size page of PDF
    const imgWidth = 29.7;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('reporteProductos.pdf');
  });
}
}
