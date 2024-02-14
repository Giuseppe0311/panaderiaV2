import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registroForm: FormGroup;
  showPassword: boolean = false;
  mensaje: string = '';
  showErrorMessage: boolean = false;
  showSuccessMessage: boolean = false;
  desabilitarBoton: boolean = false;
  authservice = inject(AuthService);
  route = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      nombre: ['', [Validators.required]],
    });
  }
  hasErrors(formgroup: FormGroup, controlName: string, errorType: string) {
    return (
      formgroup.get(controlName)?.hasError(errorType) &&
      formgroup.get(controlName)?.touched
    );
  }
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.showErrorMessage = false;
      const data = {
        usuario: this.registroForm.value.usuario,
        contrasena: this.registroForm.value.contrasena,
        dni: this.registroForm.value.dni,
        correo: this.registroForm.value.correo,
        telefono: this.registroForm.value.telefono,
        nombre: this.registroForm.value.nombre,
      };
      this.authservice.register(data).subscribe(
        (data) => {
          this.showSuccessMessage = true;
          this.desabilitarBoton = true;
          this.mensaje = 'Usuario registrado correctamente';
          this.mensaje = 'redirecting...';
          setTimeout(() => {
            this.registroForm.reset();
            this.route.navigate(['/login']);
          }, 1500);
          this.desabilitarBoton = false;
        },
        (error) => {
          this.showErrorMessage = true;
          this.desabilitarBoton = false;
          if (error.error.message) {
            this.mensaje = error.error.message;
          } else {
            this.mensaje = 'Ha ocurrido un error, por favor intente nuevamente';
          }
        }
      );
    } else {
      this.showErrorMessage = true;
      this.mensaje = 'Por favor, complete los campos correctamente';
    }
  }
}
