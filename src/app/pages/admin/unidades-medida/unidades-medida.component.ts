import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-unidades-medida',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './unidades-medida.component.html',
  styleUrl: './unidades-medida.component.css'
})
export class UnidadesMedidaComponent {
/* VARIABLES DE RUTAS */
route = inject(Router);
router= inject(ActivatedRoute);
idempresa: number | null = null;
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
  });
  this.updateform = this.formbuild.group({
    nombre: ['', Validators.required],
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
    console.log(this.idempresa);
  });
  if (this.idempresa !== null) {
    this.loadData();
  }
}
/* FUNCIONES DE CARGA DE DATOS */
loadData() {
  this.apiserviceadmin.getData(ApiType.Public,'unidadesmedida',{idempresa:this.idempresa}).subscribe({
    next: (data) => {
      this.data = data;
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
  this.formulario.reset();;
}
showModaleditar(id: number) {
  this.showEditModal = true;
  this.apiserviceadmin
    .getData(ApiType.Public,'unidadesmedida', { idunidad: id })
    .subscribe((data) => {
      this.editdata = data;
      this.updateform.patchValue({
      nombre:this.editdata.nombre,
      id: this.editdata.id,
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
  if (this.formulario.valid && this.idempresa !== null) {
    this.showsuccess = false;
    this.showerror = false;
    this.isLoading = true;
    //send data type json
   const data = {
    nombre: this.formulario.value.nombre,
    idempresa: this.idempresa,
   };
   console.log(data);
   this.apiserviceadmin.postData(ApiType.Admin,'unidadesmedida', data).subscribe(
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
       this.isLoading = false;
     }
   );
  }else{
  this.showerror = true;
  }
}
actualizar(){
  this.showsuccessupdate = false;
  this.showerrorupdate = false;
  if (this.updateform.valid && this.idempresa !== null) {
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
    this.isLoading = true;
     //send data type json
     const data = {
      nombre: this.updateform.value.nombre,
      idempresa: this.idempresa,
      id: this.updateform.value.id,
     };
     this.apiserviceadmin.updateData(ApiType.Admin,'unidadesmedida', this.updateform.value.id, data).subscribe(
       (res: any) => {
         console.log(res);
           this.loadData();
           this.isLoading = false;
           this.showsuccessupdate = true;
       },
       (err: any) => {
         this.showerrorupdate = true;
         console.log(err);
         this.isLoading = false;
       }
     );
  }else{
    this.showerrorupdate = true;
  }
}



eliminar() {
  if (this.idAEliminar!==null) {
   this.isLoading = true;
    this.apiserviceadmin.deleteData(ApiType.Admin,'unidadesmedida', this.idAEliminar).subscribe(
      (res: any) => {
        console.log(res);
        this.loadData();
        this.closemodalEliminar();
         this.isLoading = false;
        //reload page
      },
      (err: any) => {
        this.isLoading = false;
        alert('Error al eliminar la Unidad de medida'+err);
      }
    );
  }else{
    alert('No se puede eliminar la unidad de medida hubo un error al obtener el id del producto');
  }
}
}
