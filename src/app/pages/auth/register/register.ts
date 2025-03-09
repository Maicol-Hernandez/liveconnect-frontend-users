import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../service/auth.service';
import { MultiSelectPets } from '../components/MultiSelectPets';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect'
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AutoFocusModule } from 'primeng/autofocus';
import { Message } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectPets,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    MultiSelectModule,
    InputIcon,
    IconField,
    AutoFocusModule,
    Message,
    RippleModule,
  ],
  templateUrl: './register.html',
  providers: [MessageService]
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required],
      pets: [[], Validators.required]
    }, {
      validators: (group) => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
      }
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, complete todos los campos correctamente'
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const formValues = this.registerForm.value;

    this.authService.register({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      password_confirm: formValues.confirmPassword,
      pets: formValues.pets
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: '¡Bienvenido! Redirigiendo...'
        });
        setTimeout(() => this.router.navigate(['/']), 2000);
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

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
