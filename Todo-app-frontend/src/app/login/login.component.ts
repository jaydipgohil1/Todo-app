import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
        password: ['', [Validators.required, Validators.maxLength(10)]],
      }
    );
    this.isSubmitted = false;
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    try {
      this.userService.login(this.loginForm.value).subscribe(user => {
        if (!user?.data?.token) return;

        localStorage.setItem('token', JSON.stringify(user?.data?.token));
        localStorage.setItem('user', JSON.stringify({
          email: user?.data?.email,
          name: user?.data?.name,
          role: user?.data?.role,
          _id: user?.data?._id
        }));
        this.authService.setIsAuthentic(true);
        this.initForm();
        this.router.navigate(['/home']);
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

}
