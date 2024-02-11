import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-empresapage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './empresapage.component.html',
  styleUrl: './empresapage.component.css',
})
export class EmpresapageComponent implements OnInit {
  shomodal = false;
  showEditModal = false;
  //
  showEliminarModal = false;
  idAEliminar: number | null = null;
  //
  data: any = [];
  editdata: any = [];
  formulario: FormGroup;
  updateform: FormGroup;
  apiserviceadmin = inject(ApiServiceService);
  selectedFile: File | null = null;
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
      nombre: ['', Validators.required],
      informacion: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
    });
    this.updateform = this.formbuild.group({
      nombre: ['', Validators.required],
      informacion: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
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
    this.apiserviceadmin.getData(ApiType.Public,'empresas').subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  showModaleditar(id: number) {
    this.showEditModal = true;
    this.apiserviceadmin
      .getData(ApiType.Public,'empresas', { idempresa: id })
      .subscribe((data) => {
        this.editdata = data;
        this.updateform.patchValue({
          nombre: this.editdata.nombre,
          informacion: this.editdata.informacion,
          direccion: this.editdata.direccion,
          telefono: this.editdata.telefono,
          id: this.editdata.id,
        });
      });
  }
  closemodaleditar() {
    this.showEditModal = false;
    this.showsuccessupdate = false;
    this.showerrorupdate = false;
  }

  onLogoSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedFile = file; // Almacena el archivo en una propiedad
    console.log(file);
  }

  onLogoUpdateSelect(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      this.selectedFile = file; // Almacena el archivo seleccionado en la propiedad del componente
      console.log(file); // Solo para propósitos de depuración
    } else {
      this.selectedFile = null; // Limpia la propiedad si no hay archivo seleccionado
    }
  }

  showmodal() {
    this.shomodal = !this.shomodal;
    this.showsuccess = false;
    this.showerror = false;
  }
  enviar() {
    //send data
    if (this.formulario.valid) {
      this.showsuccess = false;
      this.showerror = false;
      this.isLoading = true;
      const formData = new FormData();
      formData.append('nombre', this.formulario.get('nombre')?.value);
      formData.append('informacion', this.formulario.get('informacion')?.value);
      formData.append('direccion', this.formulario.get('direccion')?.value);
      formData.append('telefono', this.formulario.get('telefono')?.value);
      if (this.selectedFile) {
        // Asume que almacenaste el archivo en this.selectedFile
        formData.append('logo', this.selectedFile, this.selectedFile.name);
      }
      this.apiserviceadmin.postDataformdata(ApiType.Superadmin,'empresas', formData).subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.formulario.reset();
          this.loadData();
          this.showsuccess = true;
          //reload page
        },
        (err: any) => {
          this.showerror = true;
          console.log(err);
          this.isLoading = false;
        }
      );
    }
  }
  //update data
  actualizar() {
    if (this.updateform.valid) {
      this.showsuccessupdate = false;
      this.showerrorupdate = false;
      this.isLoading = true;
      const formData1 = new FormData();
      formData1.append('nombre', this.updateform.get('nombre')?.value);
      formData1.append(
        'informacion',
        this.updateform.get('informacion')?.value
      );
      formData1.append('direccion', this.updateform.get('direccion')?.value);
      formData1.append('telefono', this.updateform.get('telefono')?.value);
      if (this.selectedFile) { // Verifica si hay un archivo seleccionado
        formData1.append('logo', this.selectedFile, this.selectedFile.name);
      }
      this.apiserviceadmin
        .updateDataFormdata(ApiType.Superadmin,
          'empresas',
          this.updateform.get('id')?.value,
          formData1
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            this.loadData();
            this.isLoading = false;
            this.showsuccessupdate = true;
            //reload page
          },
          (err: any) => {
            this.showerrorupdate = true;
            console.log(err);
            this.isLoading = false;
          }
        );
    }
  }
  //delete data
  eliminar(id: number) {
    this.showEliminarModal = true;
    this.idAEliminar = id;
  }
  eliminarEmpresa(){
    if (this.idAEliminar!==null) {
      this.apiserviceadmin.deleteData(ApiType.Superadmin,'empresas', this.idAEliminar).subscribe(
        (res: any) => {
          console.log(res);
          this.loadData();
          this.closemodalEliminar();
          //reload page
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
  closemodalEliminar(){
    this.showEliminarModal = false;
  }
}
