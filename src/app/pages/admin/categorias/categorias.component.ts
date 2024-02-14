import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
 /* VARIABLES DE RUTAS */
 route = inject(Router);
 router= inject(ActivatedRoute);
 idempresa: number | null = null;
 /* VARIABLES DE SERVICIOS */
 apiserviceadmin = inject(ApiServiceService);
  /* VARIABLES DE MENSAJE*/
  mensaje: string = '';
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
     descripcion: ['', Validators.required],
   });
   this.updateform = this.formbuild.group({
     nombre: ['', Validators.required],
     descripcion: ['', Validators.required],
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
   });
   if (this.idempresa !== null) {
     this.loadData();
   }
 }
 /* FUNCIONES DE CARGA DE DATOS */
 loadData() {
   this.apiserviceadmin.getData(ApiType.Public,'categorias',{idempresa:this.idempresa}).subscribe({
     next: (data) => {
       this.data = data;
       console.log(this.data);
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
     .getData(ApiType.Public,'categorias', { idcategoria: id })
     .subscribe((data) => {
       this.editdata = data;
       console.log(this.editdata);
       this.updateform.patchValue({
         nombre: this.editdata.nombre,
         descripcion: this.editdata.descripcion,
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
   //send data
   if (this.formulario.valid && this.idempresa !== null) {
     this.showsuccess = false;
     this.showerror = false;
     this.isLoading = true;
     //send data type json
    const data = {
      nombre: this.formulario.value.nombre,
      descripcion: this.formulario.value.descripcion,
      idEmpresa: this.idempresa,
    };
    this.apiserviceadmin.postData(ApiType.Admin,'categorias', data).subscribe(
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
   this.mensaje = 'Error en el formulario , verifique los datos ingresados';
   }
 }
 actualizar(){
   this.showsuccessupdate = false;
   this.showerrorupdate = false;
   if (this.updateform.valid && this.idempresa) {
     this.showsuccessupdate = false;
     this.showerrorupdate = false;
     this.isLoading = true;
      //send data type json
      const data = {
        nombre: this.updateform.value.nombre,
        descripcion: this.updateform.value.descripcion,
        idEmpresa: this.idempresa,
      };
      this.apiserviceadmin.updateData(ApiType.Admin,'categorias', this.updateform.value.id, data).subscribe(
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
      this.mensaje = 'Error en el formulario , verifique los datos ingresados';
   }
 }

 

 eliminar() {
   if (this.idAEliminar!==null) {
    this.isLoading = true;
     this.apiserviceadmin.deleteData(ApiType.Admin,'categorias', this.idAEliminar).subscribe(
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
}
