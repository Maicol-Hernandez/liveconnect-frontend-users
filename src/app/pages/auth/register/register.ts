import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../service/auth.service';
import { PetService, Pet } from '../../service/pet.service';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect'
import { ToastModule } from 'primeng/toast';
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
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    MultiSelectModule,
    ToastModule,
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
  loading = false;
  error: string | null = null;
  dataPets!: Pet[];

  constructor(
    private authService: AuthService,
    private petService: PetService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPets();
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

  loadPets(): void {
    this.petService.getPets().subscribe(({ data }: { data: Pet[] }) => {
      this.dataPets = data;
    });
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form incomplete',
        detail: 'Please, complete all fields correctly'
      });
      return;
    }

    this.loading = true;
    this.error = null;
    const formValues = this.registerForm.value;

    this.authService.register({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      password_confirm: formValues.confirmPassword,
      pets: formValues.pets.map((pet: Pet) => pet.id)
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registration successful',
          detail: 'Welcome! Redirecting...'
        });
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Registration error',
          detail: this.error || 'Unknown error'
        });
      },
      complete: () => this.loading = false
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

  get pets() {
    return this.registerForm.get('pets');
  }
}
