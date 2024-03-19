import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, public notificationService: NotificationService, private userService: UserService, private router: Router, private authService: AuthService,) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
      this.authService.setIsAuthentic(true);
    }
    this.initForm();

  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  initForm() {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
      }
    );
    this.isSubmitted = false;
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    try {
      this.userService.forgotPassword(this.loginForm.value).subscribe(user => {
        if (!user?.data) return;
        debugger

        this.initForm();
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

}
