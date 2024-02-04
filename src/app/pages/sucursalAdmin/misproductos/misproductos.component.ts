import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminempresaApiService } from '../../../features/admin/services/adminempresa-api.service';

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
apiserviceadmin = inject(AdminempresaApiService);

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
  this.apiserviceadmin.getData('productos',{idsucursal:this.idsucursal}).subscribe({
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
  this.apiserviceadmin.getData('productos',{idempresa:this.idempresa}).subscribe({
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
    .getData('productos', { idProductoSucursal: id })
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
   this.apiserviceadmin.postData('productosucursal', data).subscribe(
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
     this.apiserviceadmin.updateData('productosucursal', this.updateform.value.id, data).subscribe(
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
    this.apiserviceadmin.deleteData('productosucursal', this.idAEliminar).subscribe(
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
}
