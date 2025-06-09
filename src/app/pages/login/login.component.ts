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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', [Validators.required]], // Pre-fill for testing
      password: ['admin123', [Validators.required]], // Pre-fill for testing
    });
  }

  onSubmit(): void {
    console.log('Login form submitted');
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const { username, password } = this.loginForm.value;
      console.log('Attempting login with:', { username, password: '***' });

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error =
            err.error?.message ||
            err.message ||
            'An error occurred during login';
          this.loading = false;
        },
      });
    } else {
      console.log('Form is invalid:', this.loginForm.errors);
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
