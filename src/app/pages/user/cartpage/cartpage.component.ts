import { Component, NgModule, OnInit, inject } from '@angular/core';
import { CarthandlerService } from '../../../features/user/services/carthandler.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiServiceService,
  ApiType,
} from '../../../core/services/api-service.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgModel,
  NgModelGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
interface DetalleVentasRequest {
  idproducto: number;
  cantidad: number;
  precio_venta: number;
  subtotal: number;
}
@Component({
  selector: 'app-cartpage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cartpage.component.html',
  styleUrl: './cartpage.component.css',
})
export class CartpageComponent implements OnInit {
  isLoading: boolean = false
  tipoDocumento: 'boleta' | 'factura' = 'boleta'; // Valor predeterminado
  private authservice = inject(AuthService);
  private route = inject(Router);
  private router = inject(ActivatedRoute);
  private apiservice = inject(ApiServiceService);
  private idsucursal: number = 0;
  direccionSucursal: string = '';
  precioenvio?: string;
  auxiliar?: number;

  cartitems!: any[];
  carService = inject(CarthandlerService);
  idusuario: number = 0;
  documentoForm: FormGroup;
  constructor(private formbuild: FormBuilder) {
    // Inicializa el formulario con el valor predeterminado para tipoDocumento
    this.documentoForm = this.formbuild.group({
      tipoDocumento: ['', Validators.required],
      numerodocumento: ['', [Validators.required]], // Validación inicial básica
      tipoPago: ['efectivo', Validators.required],
      envio: ['recojo', Validators.required],
    });
  
    // Escucha cambios en el campo 'tipoDocumento'
    this.documentoForm.get('tipoDocumento')?.valueChanges.subscribe(tipoDocumento => {
      const numerodocumento = this.documentoForm.get('numerodocumento');
      if (tipoDocumento === 'boleta') {
        numerodocumento?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
      } else {
        numerodocumento?.setValidators([Validators.required, Validators.pattern('^[0-9]{11}$')]);
      }
      numerodocumento?.updateValueAndValidity(); // Actualiza la validez del campo
    });
    
  }
  
  hasErrors(controlName: string, errorType: string) {
    return (
      this.documentoForm.get(controlName)?.hasError(errorType) &&
      this.documentoForm.get(controlName)?.touched
    );
  }
  ngOnInit(): void {
    this.items;
    this.router.parent?.params.subscribe((params) => {
      this.idsucursal = params['idsucursal'];
      this.apiservice
        .getData(ApiType.Public, 'sucursales', { idsucursal: this.idsucursal })
        .subscribe((data) => {
          this.direccionSucursal = data.direccion;
        });
    });
  }
  get items(): any {
    return (this.cartitems = this.carService.getItems());
  }
  get total(): number {
    return this.cartitems.reduce((subtotal, item) => {
      const precio = parseFloat(item.product.precioLocal);
      const value = subtotal + precio * item.quantity;
      return value;
    }, 0);
  }
  incrementar(id: number) {
    this.cartitems.find((item) => {
      if (item.product.productos.id == id) {
        this.carService.addItem(item.product, 1);
      }
    });
  }
  decrementar(id: number) {
    this.cartitems.find((item) => {
      if (item.product.productos.id == id) {
        if (item.quantity > 1) {
          this.carService.addItem(item.product, -1);
        }
      }
    });
  }
  deleteproduct(idproducto: number) {
    this.carService.deleteItem(idproducto);
  }
  placeorder() {
    if (this.carService.getItems().length == 0) {
      alert('No hay productos en el carrito');
    } else {
      if (this.documentoForm.invalid) {
        alert('Complete los campos');
        return;
      }
      this.isLoading = true;
      //obtener el usuario logueado
      this.authservice.currentUserData.subscribe((data) => {
        this.idusuario = data.idusuario;
      });
      const productos : DetalleVentasRequest[] = this.cartitems.map((item) => {
        return {
          idproducto: item.product.productos.id,
          cantidad: item.quantity,
          precio_venta: item.product.precioLocal,
          subtotal: item.product.precioLocal * item.quantity
        };
      });
      console.log(productos);

      const  datos =  {
        idsucursal: this.idsucursal,
        idusuario: this.idusuario,
        tipo_pago: this.documentoForm.get('tipoPago')?.value,
        tipo_comprobante: this.documentoForm.get('tipoDocumento')?.value,
        num_comprobante: this.documentoForm.get('numerodocumento')?.value,
        total: this.total,
        productos: productos
      }
      this.apiservice.postData(ApiType.User,'ventas',datos).subscribe(
        (res: any) => {
          this.route.navigate(['thankspage'], { relativeTo: this.router.parent });
          console.log(res);
        },
        (err: any) => {
          console.log(err);
        }
      ); 
      
      this.carService.clearCart();
      this.items;
      this.documentoForm.reset();
      this.isLoading = false;
    }
  }
  reset() {
    this.documentoForm.get('numerodocumento')?.setValue('');
  }
}
