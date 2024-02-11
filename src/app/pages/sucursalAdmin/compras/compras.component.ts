import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiServiceService,
  ApiType,
} from '../../../core/services/api-service.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// DECLARAMOS UNA INTERFAZ PARA EL DETALLE DE LA COMPRA
interface DetalleCompra {
  producto: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
})
export class ComprasComponent implements OnInit {
  router = inject(ActivatedRoute);
  idsucursal: number | null = null;
  dataProvedores: any[] = [];
  apiservice = inject(ApiServiceService);
  // DECLAMOS UN ARRAY DE TIPO DETALLECOMPRA
  detalleCompras: DetalleCompra[] = [];
  // SE DECLARA EL FORMULARIO
  formulario: FormGroup;
  formularioUpdate: FormGroup;
  // VARIABLE PARA MOSTRAR MODAL
  showEditModal = false;
  indiceProductoAEditar: number | null = null;

  // SE INICIALIZA EL FORMULARIO CON LOS CAMPOS QUE SE NECESITAN
  constructor(private formbuild: FormBuilder) {
    this.formulario = this.formbuild.group({
      proveedor: ['', Validators.required],
      ruc: [, Validators.required],
      direccion: ['', Validators.required],
      tipoComprobante: ['boleta', Validators.required],
      numeroComprobante: ['', Validators.required],
      fecha: ['', Validators.required],
      nombreproducto: [''],
      cantidad: ['', [Validators.pattern('^[0-9]{1,4}$')]],
      precio: ['', [Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
      subtotal: ['', [Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')]],
      tipago: ['CONTADO', Validators.required],
      estadoPago: ['PAGADO', Validators.required],
      total: ['', Validators.required],
    });
    this.formularioUpdate = this.formbuild.group({
      nombreproducto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
      precio: [
        '',
        [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')],
      ],
      subtotal: [
        '',
        [Validators.required, Validators.pattern('^(\\d{1,3})(\\.\\d{1,2})?$')],
      ],
    });
  }
  //  INICIALIZA LOS DATOS AL CARGAR EL COMPONENTE
  ngOnInit(): void {
    this.router.parent?.params.subscribe((params) => {
      this.idsucursal = Number(params['idsucursal']);
    });
    if (this.idsucursal !== null) {
      this.loadProveedores();
    }

    this.formulario.get('cantidad')!.valueChanges.subscribe((val) => {
      this.actualizarSubtotal();
    });

    this.formulario.get('precio')!.valueChanges.subscribe((val) => {
      this.actualizarSubtotal();
    });
    this.formularioUpdate.get('cantidad')!.valueChanges.subscribe((val) => {
      this.actualizarSubtotaldelModal();
    });

    this.formularioUpdate.get('precio')!.valueChanges.subscribe((val) => {
      this.actualizarSubtotaldelModal();
    });
  }
  // CARGA LOS DATOS DE LOS PROVEEDORES
  loadProveedores() {
    this.apiservice
      .getData(ApiType.AdminSucursal, 'proveedores', {
        idSucursal: this.idsucursal,
      })
      .subscribe((data) => {
        console.log(data);
        this.dataProvedores = data;
      });
  }
  // VALIDACION DE FORMULARIO
  hasErrors(formgroup: FormGroup, controlName: string, errorType: string) {
    return (
      formgroup.get(controlName)?.hasError(errorType) &&
      formgroup.get(controlName)?.touched
    );
  }

  // FUNCIONES DE ENVIO DE FORMULARIO
  registrar() {
    if(this.formulario.valid && this.detalleCompras.length > 0){
      const dataaenviar ={
        idproveedor: this.formulario.get('proveedor')!.value,
        totalCompra: this.formulario.get('total')!.value,
        idsucursal: this.idsucursal,
        tipo_comprobante: this.formulario.get('tipoComprobante')!.value,
        num_comprobante: this.formulario.get('numeroComprobante')!.value,
        tipo_pago: this.formulario.get('tipago')!.value,
        estado_pago: this.formulario.get('estadoPago')!.value,
        fecha: this.formulario.get('fecha')!.value,
        detalleCompras: this.detalleCompras
      }
      this.apiservice.postData(ApiType.AdminSucursal, 'compras', dataaenviar).subscribe({
        next: (data) => {
          console.log(data);
          this.formulario.reset();
          this.detalleCompras = [];
          alert('Se registro la compra correctamente');
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrio un error al registrar la compra');
        },
      });
    }else{
      alert('Por favor llene todos los campos');
    }
  }
  // Funciones de reconocimiento de cambios
  cambio(evento: any) {
    const idSeleccionado = Number(evento.target.value);
    console.log(idSeleccionado);
    const proveedorSeleccionado = this.dataProvedores.find(
      (proveedor) => proveedor.id === idSeleccionado
    );
    if (proveedorSeleccionado) {
      this.formulario.patchValue({
        ruc: proveedorSeleccionado.ruc,
        direccion: proveedorSeleccionado.direccion,
      });
    }
  }

  actualizarSubtotal(): void {
    const cantidad = this.formulario.get('cantidad')!.value || 0;
    const precio = this.formulario.get('precio')!.value || 0;
    const subtotal = cantidad * precio;
    this.formulario.patchValue({
      subtotal: subtotal.toFixed(2), // Ajusta a dos decimales
    });
  }
  actualizarSubtotaldelModal(): void {
    const cantidad = this.formularioUpdate.get('cantidad')!.value || 0;
    const precio = this.formularioUpdate.get('precio')!.value || 0;
    const subtotal = cantidad * precio;
    this.formularioUpdate.patchValue({
      subtotal: subtotal.toFixed(2), // Ajusta a dos decimales
    });
  }
  addProductToTable() {
    // Verifica que todos los campos estén llenos
    if (
      this.formulario.get('nombreproducto')!.value.trim() === '' ||
      this.formulario.get('cantidad')!.value === '' ||
      this.formulario.get('precio')!.value === '' ||
      this.formulario.get('subtotal')!.value === ''
    ) {
      alert('Por favor llene todos los campos');
      return;
    }

    // Obtiene los valores del formulario y limpia/normaliza el nombre del producto
    const producto: string = this.formulario
      .get('nombreproducto')!
      .value.trim()
      .toLowerCase(); // Limpia espacios y convierte a minúsculas
    const cantidad = parseFloat(this.formulario.get('cantidad')!.value);
    const precio = parseFloat(this.formulario.get('precio')!.value);
    const subtotal = cantidad * precio; // Recalcula el subtotal basado en la nueva cantidad y precio

    // Busca si el producto ya existe en el detalle de compras
    const productoExistente = this.detalleCompras.find(
      (p) => p.producto.toLowerCase() === producto // Asegúrate de llamar a toLowerCase() como un método
    );

    // Chequea si el producto ya existe en el detalle de compras
    if (productoExistente) {
      alert('El producto ya existe en el detalle de compras');
    } else {
      // Si el producto no existe, lo agrega al array
      this.detalleCompras.push({
        producto: this.formulario.get('nombreproducto')!.value.trim(),
        cantidad,
        precio,
        subtotal,
      });
    }

    // Limpia los campos del formulario después de agregar o actualizar un producto
    this.formulario.patchValue({
      nombreproducto: '',
      cantidad: '',
      precio: '',
      subtotal: '',
    });

    // Calcula el total general después de cualquier cambio
    this.calcularTotalGeneral();
    console.log(this.detalleCompras);
  }
  calcularTotalGeneral() {
    const total = this.detalleCompras.reduce(
      (acumulador, itemActual) => acumulador + itemActual.subtotal,
      0
    );
    this.formulario.patchValue({
      total: total.toFixed(2), // Formatea el total a dos decimales
    });
  }
  // Elimina un producto del detalle de compras
  eliminarProducto(indice: number) {
    this.detalleCompras.splice(indice, 1);
    this.calcularTotalGeneral();
  }
  // ACTULIZAR PRODUCTO
  actualizarProducto() {
    if (this.indiceProductoAEditar != null) {
      const productoActualizado = this.formularioUpdate.value;
      this.detalleCompras[this.indiceProductoAEditar] = {
        producto: productoActualizado.nombreproducto,
        cantidad: productoActualizado.cantidad,
        precio: productoActualizado.precio,
        subtotal: productoActualizado.cantidad * productoActualizado.precio,
      };
      this.calcularTotalGeneral();
      this.showEditModal = false; // Ocultar el modal
      this.formulario.reset(); // Opcional: resetear el formulario
    }
  }

  // MOSTAR MODAL
  prepararEdicion(indice: number) {
    this.indiceProductoAEditar = indice;
    const producto = this.detalleCompras[indice];
    this.formularioUpdate.patchValue({
      nombreproducto: producto.producto,
      cantidad: producto.cantidad,
      precio: producto.precio,
      subtotal: producto.subtotal,
    });
    this.showEditModal = true;
  }
}
