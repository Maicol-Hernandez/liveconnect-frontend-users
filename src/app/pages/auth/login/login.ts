import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield'
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon'
import { AutoFocusModule } from 'primeng/autofocus';
import { Message } from 'primeng/message';

import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    FloatLabelModule,
    ToastModule,
    InputIconModule,
    AutoFocusModule,
    Message,
    RippleModule
  ],
  templateUrl: './login.html',
  providers: [MessageService]
})
export class Login implements OnInit {
  loginForm!: FormGroup
  isSubmitting = false
  errorMessage: string | null = null

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      remember: [false]
    })
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form incomplete',
        detail: 'Please, complete all fields correctly'
      })
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const formValues = this.loginForm.value;

    this.authService.login({
      email: formValues.email,
      password: formValues.password
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login successful',
          detail: 'Welcome! Redirecting...'
        })
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Login error',
          detail: this.errorMessage || 'Unknown error'
        })
      },
      complete: () => this.isSubmitting = false
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
