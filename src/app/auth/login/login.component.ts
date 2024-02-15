import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formularioRegistro :FormGroup
  authservice= inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute)
  private router: Router = inject(Router)
   mensaje: string = '';
  showErrorMessage: boolean = false;
  constructor(private form : FormBuilder) {
    this.formularioRegistro = this.form.group({
      usuario: ['',Validators.required],
      contrasena: ['',Validators.required]
    })
  }
  login(){
    if (!this.formularioRegistro.valid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }
    console.log(this.formularioRegistro.value);
    this.authservice.login(this.formularioRegistro.value.usuario, this.formularioRegistro.value.contrasena).subscribe({
      next: (data: any) => {
        const decodeToken = this.authservice.decodeToken();
        console.log(decodeToken);
        console.log(decodeToken.idempresa)
        if (decodeToken.roles === 'ADMINSUCURSAL') {
          this.router.navigate([`/empresa/${decodeToken.idempresa}/sucursal/${decodeToken.idsucursal}/admin`]);
        }else if (decodeToken.roles === 'SUPERADMIN') {
          this.router.navigate([`/SUPERADMIN`]);{
            this.router.navigate([`/admin`]);
          }
        }else if(decodeToken.roles === 'ADMIN'){
          this.router.navigate([`/empresa/${decodeToken.idempresa}/admin`]);
        }else if(decodeToken.roles === 'USER'){
          //redireccionar a la pagina de usuario del return url o a la raiz
          if (this.isBrowser()) {
            const returnUrl = localStorage.getItem('returnUrl') || '/';
            this.router.navigateByUrl(returnUrl);
          }
        }
      },
      error: (error) => {
        console.error(error);
        // Maneja errores de login aquí, como mostrar un mensaje al usuario
        this.showErrorMessage = true;
        console.log(error)
        if (error.error.message) {
          this.mensaje = error.error.message;
        }else{
          this.mensaje = 'Error al iniciar sesión, intente nuevamente';
        }
      }
    });
  }
  logout(){
    this.authservice.logout();
  }
  toregister(){
    this.router.navigate(['/register']);
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
  hasErrors(formgroup: FormGroup, controlName: string, errorType: string) {
    return (
      formgroup.get(controlName)?.hasError(errorType) &&
      formgroup.get(controlName)?.touched
    );
  }

}
