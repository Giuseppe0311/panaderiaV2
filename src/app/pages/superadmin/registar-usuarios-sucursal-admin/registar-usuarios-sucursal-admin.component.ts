import { Component, inject } from '@angular/core';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-registar-usuarios-sucursal-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registar-usuarios-sucursal-admin.component.html',
  styleUrl: './registar-usuarios-sucursal-admin.component.css'
})
export class RegistarUsuariosSucursalAdminComponent {
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
  empresas :any[] = [];
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
      empresaasignada: ['', Validators.required],
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
      empresaasignada: ['', Validators.required],
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
    this.loadData();
  }
  //load data :

  loadData() {
    this.apiserviceadmin.getData(ApiType.Superadmin,'usuarios',{byEmpresa:true}).subscribe({
      next: (data) => {
        this.data = data;
        console.log(data)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  loadDataEmpresas() {
    this.apiserviceadmin.getData(ApiType.Public,'empresas').subscribe({
      next: (data) => {
        console.log(data);
        this.empresas = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  showModaleditar(id: number) {
    this.showEditModal = true;
    console.log(id)
    this.loadDataEmpresas();
   this.apiserviceadmin.getData(ApiType.Superadmin,'usuarios',{idusuario:id}).subscribe({
      next: (data) => {
        console.log(data);
        this.updateform.patchValue({
          usuario: data.usuario,
          dni: data.dni,
          correo: data.correo,
          telefono: data.telefono,
          nombreusuario: data.nombre,
          empresaasignada: data.idEmpresaAsociada,
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
    this.loadDataEmpresas();
    this.shomodal = !this.shomodal;
    this.showsuccess = false;
    this.showerror = false;
    this.formulario.reset();
  }
  enviar() {
    //send data
    console.log(this.formulario);
    if (this.formulario.valid) {
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
        idempresa: this.formulario.value.empresaasignada,
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
    if (this.updateform.valid) {
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
        idempresa: this.updateform.value.empresaasignada,
      }
      this.apiserviceadmin.updateData(ApiType.Superadmin,'usuarios',this.updateform.value.id,data).subscribe(
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
      this.apiserviceadmin.deleteData(ApiType.Superadmin,'usuarios', this.idAEliminar).subscribe(
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
