import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent {
/* VARIABLES DE RUTAS */
route = inject(Router);
router= inject(ActivatedRoute);
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

/* VARIABLES DE DATOS */
data: any = [];
editdata: any = [];
/* VARIABLES DE  MENSAJES*/
mensaje: string = '';
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
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [Validators.required, Validators.email]],
    ruc: ['',[ Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11), Validators.maxLength(11)]],
  });
  this.updateform = this.formbuild.group({
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
    email: ['', [Validators.required, Validators.email]],
    //EL RUC DE SER UN NUMERO DE 11 DIGITOS
    ruc: ['',[ Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(11), Validators.maxLength(11)]],
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

  });
  if (this.idsucursal !== null) {
    this.loadData();
  }
}
/* FUNCIONES DE CARGA DE DATOS */
loadData() {
  this.apiserviceadmin.getData(ApiType.AdminSucursal,'proveedores',{idSucursal:this.idsucursal}).subscribe({
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
showmodalregistrar() {
  this.showregistermodal = !this.showregistermodal;
  this.showsuccess = false;
  this.showerror = false;
  this.formulario.reset();
}
showModaleditar(id: number) {
  this.showEditModal = true;
  this.apiserviceadmin
    .getData(ApiType.AdminSucursal,'proveedores', { idProveedor: id })
    .subscribe((data) => {
      this.editdata = data;
      console.log(this.editdata);
      this.updateform.patchValue({
        nombre: this.editdata.nombre,
        direccion: this.editdata.direccion,
        telefono: this.editdata.telefono,
        email: this.editdata.email,
        ruc: this.editdata.ruc,
        id: this.editdata.id, 
      });
    });
}
closemodaleditar() {
  this.showEditModal = false;
  this.showsuccessupdate = false;
  this.showerrorupdate = false;
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
}
/* FUNCIONES DE SUBMIT */

registrar() {
  this.showsuccess = false;
  this.showerror = false;
  console.log(this.formulario);
  //send data
  if (this.formulario.valid && this.idsucursal !== null) {
    this.showsuccess = false;
    this.showerror = false;
    this.isLoading = true;
    //send data type json
   const data = {
     nombre: this.formulario.value.nombre,
      direccion: this.formulario.value.direccion,
      telefono: this.formulario.value.telefono,
      email: this.formulario.value.email,
      ruc: this.formulario.value.ruc,
      idSucursal: this.idsucursal,
   };
    console.log(data);
    this.apiserviceadmin.postData(ApiType.AdminSucursal,'proveedores', data).subscribe(
      (res: any) => {
        console.log(res);
        this.loadData();
        this.isLoading = false;
        this.formulario.reset();
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
  if (this.updateform.valid && this.idsucursal!==null) {
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
    this.isLoading = true;
     //send data type json
     const data = {
      nombre: this.updateform.value.nombre,
      direccion: this.updateform.value.direccion,
      telefono: this.updateform.value.telefono,
      email: this.updateform.value.email,
      ruc: this.updateform.value.ruc,
      idSucursal: this.idsucursal,
     };
     this.apiserviceadmin.updateData(ApiType.AdminSucursal,'proveedores', this.updateform.value.id, data).subscribe(
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
    this.apiserviceadmin.deleteData(ApiType.AdminSucursal,'proveedores', this.idAEliminar).subscribe(
      (res: any) => {
        console.log(res);
        this.loadData();
        this.closemodalEliminar();
         this.isLoading = false;
        //reload page
      },
      (err: any) => {
        alert('Error al eliminar la empresa'+err);
      }
    );
  }else{
    alert('No se puede eliminar el producto hubo un error al obtener el id del producto');
  }
  
}
exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'ReportedeProveedores.xlsx');
}

exportToPDF(): void {
  html2canvas(document.querySelector("#tablaProveedores") as HTMLElement).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('l', 'cm', 'a4'); // Generates PDF in landscape mode
    // A4 size page of PDF
    const imgWidth = 29.7;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('ReportedeProveedores.pdf');
  });
}
}
