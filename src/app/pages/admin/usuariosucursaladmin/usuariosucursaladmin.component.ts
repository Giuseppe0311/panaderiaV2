import { Component, OnInit, inject } from '@angular/core';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuariosucursaladmin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './usuariosucursaladmin.component.html',
  styleUrl: './usuariosucursaladmin.component.css'
})
export class UsuariosucursaladminComponent implements OnInit{
  router = inject(ActivatedRoute);
  idEmpresa: number | null = null;
   // Inicializa el tipo de input como 'password'
   tipoInput = 'password';
  shomodal = false;
  showEditModal = false;
  //
  showEliminarModal = false;
  idAEliminar: number | null = null;
  mensaje: string = '';
  //
  data: any = [];
  editdata: any = [];
  sucursales :any[] = [];
  formulario: FormGroup;
  updateform: FormGroup;
  apiserviceadmin = inject(ApiServiceService);
  authService= inject(AuthService);
  //
  showsuccess = false;
  showerror = false;
  //
  showsuccessupdate = false;
  showerrorupdate = false;
  //
  isLoading: boolean = false; // Para mostrar un spinner mientras se cargan los datos
  constructor(private formbuild: FormBuilder) {
    this.formulario = this.formbuild.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(8)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
      nombreusuario: ['', Validators.required],
      sucursalasignada: ['', Validators.required],
    });
    this.updateform = this.formbuild.group({
      usuario: ['', Validators.required],
      contrasena: [''],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(8)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
      nombreusuario: ['', Validators.required],
      sucursalasignada: ['', Validators.required],
      id: [null],
    });
  }
  hasErrors(formgroup: FormGroup, controlName: string, errorType: string) {
    return (
      formgroup.get(controlName)?.hasError(errorType) &&
      formgroup.get(controlName)?.touched
    );
  }
  ngOnInit(): void {
    this.router.parent?.params.subscribe((params) => {
      this.idEmpresa = params["idempresa"];
      console.log(this.idEmpresa);
    });
    this.loadData();
  }
  //load data :

  loadData() {
    this.apiserviceadmin.getData(ApiType.Admin,'usuarios',{idEmpresa:this.idEmpresa}).subscribe({
      next: (data) => {
        this.data = data;
        console.log(data)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  loadDataSucursales() {
    if (this.idEmpresa!==null) {
    this.apiserviceadmin.getData(ApiType.Public,'sucursales',{idempresa:this.idEmpresa}).subscribe({
      next: (data) => {
        console.log(data);
        this.sucursales = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }else{
    alert('No se ha seleccionado una empresa para cargar las sucursales');
  }
  }
  showModaleditar(id: number) {
    this.showEditModal = true;
    console.log(id)
    this.loadDataSucursales();
   this.apiserviceadmin.getData(ApiType.Admin,'usuarios',{idusuario:id}).subscribe({
      next: (data) => {
        console.log(data);
        this.updateform.patchValue({
          usuario: data.usuario,
          dni: data.dni,
          correo: data.correo,
          telefono: data.telefono,
          nombreusuario: data.nombre,
          sucursalasignada: data.idSucursalAsociada,
          id: data.id,
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  closemodaleditar() {
    this.showEditModal = false;
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
    this.updateform.reset();
  }




  showmodal() {
    this.loadDataSucursales();
    this.shomodal = !this.shomodal;
    this.showsuccess = false;
    this.showerror = false;
    this.formulario.reset();
  }
  enviar() {
    //send data
    console.log(this.formulario);
    if (this.formulario.valid && this.idEmpresa!==null) {
      this.showsuccess = false;
      this.showerror = false;
      this.isLoading = true;
      const datos = {
        usuario: this.formulario.value.usuario,
        contrasena: this.formulario.value.contrasena,
        dni: this.formulario.value.dni,
        correo: this.formulario.value.correo,
        telefono: this.formulario.value.telefono,
        nombre: this.formulario.value.nombreusuario,
        idempresa: this.idEmpresa,
        idsucursal: this.formulario.value.sucursalasignada,
      };
     this.authService.register(datos).subscribe(
        (res: any) => {
          console.log(res);
          this.showsuccess = true;
          this.isLoading = false;
          this.loadData();
        },
        (err: any) => {
          console.log(err);
          this.showerror = true;
          this.isLoading = false;
          if (err.error.message) {
            this.mensaje = err.error.message;
            
          }else{
            this.mensaje = 'Error en el servidor, intente mas tarde';
          }
        }
      );
    }else{
      this.showerror = true;
      this.mensaje = 'Error en el formulario, verifique los campos';
    }
  }
  //update data
  actualizar() {
    if (this.updateform.valid && this.idEmpresa!==null) {
      this.showsuccessupdate = false;
      this.showerrorupdate = false;
      this.isLoading = true;
      const data = {
        usuario: this.updateform.value.usuario,
        contrasena: this.updateform.value.contrasena,
        dni: this.updateform.value.dni,
        correo: this.updateform.value.correo,
        telefono: this.updateform.value.telefono,
        nombre: this.updateform.value.nombreusuario,
        idempresa: this.idEmpresa,
        idsucursal: this.updateform.value.sucursalasignada,
      }
      this.apiserviceadmin.updateData(ApiType.Admin,'usuarios',this.updateform.value.id,data).subscribe(
        (res: any) => {
          console.log(res);
          this.showsuccessupdate = true;
          this.isLoading = false;
          this.loadData();
        },
        (err: any) => {
          console.log(err);
          this.showerrorupdate = true;
          this.isLoading = false;
          if (err.error.message) {
            this.mensaje = err.error.message;
          }else{
            this.mensaje = 'Error en el servidor, intente mas tarde';
          }
        }
      );
     
    }else{
      this.showerrorupdate = true;
      this.mensaje = 'Error en el formulario, verifique los campos';
    }
  }
  //delete data
  eliminar(id: number) {
    this.showEliminarModal = true;
    this.idAEliminar = id;
  }
  eliminarEmpresa(){
    if (this.idAEliminar!==null) {
      this.apiserviceadmin.deleteData(ApiType.Admin,'usuarios', this.idAEliminar).subscribe(
        (res: any) => {
          console.log(res);
          this.loadData();
          this.closemodalEliminar();
        },
        (err: any) => {
          console.log(err);
          alert('Error al eliminar el usuario');
        }
      );
    }
  }
  closemodalEliminar(){
    this.showEliminarModal = false;
  }
  togglePasswordVisibility(): void {
    this.tipoInput = this.tipoInput === 'password' ? 'text' : 'password';
  }
}
