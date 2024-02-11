import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
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
  categoriasdata: any = [];
  unidadmedidadata: any = [];
  editdata: any = [];
  selectedFile: File | null = null;

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
      precioBase: ['', [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
      categoria: ['',Validators.required],
      unidad: ['',[Validators.required]],
      stock: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.updateform = this.formbuild.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioBase: ['', [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
      categoria: ['',Validators.required],
      stock: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
      unidad: ['',[Validators.required]],
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
  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedFile = file; // Almacena el archivo en una propiedad
    console.log(file);
  }
  onFileUpdateSelect(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      this.selectedFile = file; // Almacena el archivo seleccionado en la propiedad del componente
      console.log(file); // Solo para propósitos de depuración
    } else {
      this.selectedFile = null; // Limpia la propiedad si no hay archivo seleccionado
    }
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
    this.apiserviceadmin.getData(ApiType.Public,'productos',{idempresa:this.idempresa}).subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  loadCategorias() {
    this.apiserviceadmin.getData(ApiType.Public,'categorias',{idempresa:this.idempresa}).subscribe({
      next: (data) => {
        this.categoriasdata = data;
        // console.log(this.categoriasdata);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadUnidadMedida() {
    this.apiserviceadmin.getData(ApiType.Public,'unidadesmedida',{idempresa:this.idempresa}).subscribe({
      next: (data) => {
        this.unidadmedidadata = data;
        console.log(this.unidadmedidadata);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }


  /* FUNCIONES DE MODALES */
  showmodalregistrar() {
    this.selectedFile = null;
    this.showregistermodal = !this.showregistermodal;
    this.showsuccess = false;
    this.showerror = false;
    this.formulario.reset();
    this.loadCategorias();
    this.loadUnidadMedida();
    this.formulario.reset();
  }
  showModaleditar(id: number) {
    this.selectedFile = null;
    //limpia todos los campos
    this.updateform.reset();
    this.loadCategorias();
    this.loadUnidadMedida();
    this.showEditModal = true;
    this.apiserviceadmin
      .getData(ApiType.Public,'productos', { idproducto: id })
      .subscribe((data) => {
        this.editdata = data;
        console.log(this.editdata);
        this.updateform.patchValue({
          nombre: this.editdata.nombre,
          descripcion: this.editdata.descripcion,
          categoria: this.editdata.idcategoria,
          unidad: this.editdata.idUnidadMedida,
          precioBase: this.editdata.precioBase,
          stock: this.editdata.stock,
          id: this.editdata.id,
        });
        console.log(this.editdata.idUnidadMedida)
      });
  }
  closemodaleditar() {
    this.updateform.reset();
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
    if (this.formulario.valid && this.idempresa !== null && this.selectedFile) {
      this.showsuccess = false;
      this.showerror = false;
      this.isLoading = true;
      const formData = new FormData();
      formData.append('nombre', this.formulario.get('nombre')?.value);
      formData.append('descripcion', this.formulario.get('descripcion')?.value);
      formData.append('precioBase', this.formulario.get('precioBase')?.value);
      formData.append('idcategoria', this.formulario.get('categoria')?.value);
      formData.append('stock', this.formulario.get('stock')?.value);
      formData.append('idempresa', this.idempresa?.toString()!);
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
      formData.append('idunidadMedida', this.formulario.get('unidad')?.value);

      this.apiserviceadmin.postDataformdata(ApiType.Admin,'productos', formData).subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.formulario.reset();
          this.loadData();
          this.showsuccess = true;
          this.showregistermodal = false;
          //reload page
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
    if (this.updateform.valid && this.idempresa) {
      this.showsuccessupdate = false;
      this.showerrorupdate = false;
      this.isLoading = true;
      const formData1 = new FormData();
      formData1.append('nombre', this.updateform.get('nombre')?.value);
      formData1.append('descripcion', this.updateform.get('descripcion')?.value);
      formData1.append('precioBase', this.updateform.get('precioBase')?.value);
      formData1.append('idcategoria', this.updateform.get('categoria')?.value);
      formData1.append('idunidadMedida', this.updateform.get('unidad')?.value);
      formData1.append('stock', this.updateform.get('stock')?.value);
      formData1.append('idempresa', this.idempresa?.toString()!);
      if (this.selectedFile) { // Verifica si hay un archivo seleccionado
        formData1.append('imagen', this.selectedFile, this.selectedFile.name);
      }
      this.apiserviceadmin
        .updateDataFormdata(
          ApiType.Admin,
          'productos',
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
    }else{
      this.showerrorupdate = true;
    }
  }

  

  eliminar() {
    if (this.idAEliminar!==null) {
      this.isLoading = true;
      this.apiserviceadmin.deleteData(ApiType.Admin,'productos', this.idAEliminar).subscribe(
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
