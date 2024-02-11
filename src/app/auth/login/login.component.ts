import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  constructor(private form : FormBuilder) {
    this.formularioRegistro = this.form.group({
      usuario: [''],
      contrasena: ['']
    })
  }
  login(){
    console.log(this.formularioRegistro.value);
    this.authservice.login(this.formularioRegistro.value.usuario, this.formularioRegistro.value.contrasena).subscribe({
      next: (data: any) => {
        console.log(data);
        // Guarda el token o realiza cualquier acción necesaria después del login aquí
        
        // Recupera el returnUrl de los queryParams
        if(this.isBrowser()){
          const returnUrl = localStorage.getItem('returnUrl') || '/';
          localStorage.removeItem('returnUrl'); // Opcional: eliminar el returnUrl después de usarlo;
           this.router.navigateByUrl(returnUrl);
        }
        
        
        // Redirige al usuario al returnUrl o a la página de inicio por defecto
       
      },
      error: (error) => {
        console.error(error);
        // Maneja errores de login aquí, como mostrar un mensaje al usuario
      }
    });
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

}
