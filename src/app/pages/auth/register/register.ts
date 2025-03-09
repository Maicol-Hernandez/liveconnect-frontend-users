import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect'
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AutoFocusModule } from 'primeng/autofocus';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../service/auth.service';
import { MessageService } from 'primeng/api';
import { MultiSelectPets } from '../../pet/MultiSelectPets';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    MultiSelectModule,
    RippleModule,
    AutoFocusModule,
    InputIcon,
    IconField,
    RouterModule,
    MultiSelectPets
  ],
  templateUrl: './register.html',
  providers: [MessageService]
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  pets: string[] = [];
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirm: this.confirmPassword,
      pets: this.pets
    }).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: '¡Bienvenido! Redirigiendo...'
        });
        // setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: this.errorMessage || 'Error desconocido'
        });
      },
      complete: () => this.isSubmitting = false
    });
  }
}
