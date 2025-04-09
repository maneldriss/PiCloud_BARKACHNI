import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
  
    this.isLoading = true;
    this.message = '';
  
    const email = this.form.get('email')?.value;
    
    this.authService.forgotPassword(email).subscribe({
        next: () => {
            this.message = 'If an account exists with this email, you will receive a reset link.';
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Full error:', err);
            
            // Improved error messages
            if (err.error?.message) {
                this.message = err.error.message;
            } else if (err.status === 400) {
                this.message = 'Invalid email format. Please check your email address.';
            } else if (err.status === 404) {
                this.message = 'No account found with this email address.';
            } else {
                this.message = 'A technical error occurred. Please try again later.';
            }
            
            this.isLoading = false;
        }
    });
}
}