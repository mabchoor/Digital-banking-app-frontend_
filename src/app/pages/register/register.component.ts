import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit(): void {
    console.log('Register form submitted');
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const registerData = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value,
      };

      console.log('Attempting registration with:', {
        username: registerData.username,
        password: '***',
      });

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.error =
            err.error?.message ||
            err.message ||
            'An error occurred during registration';
          this.loading = false;
        },
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
