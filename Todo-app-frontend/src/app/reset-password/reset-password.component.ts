import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  isSubmitted = false;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  token!: any;
  constructor(private fb: FormBuilder, public notificationService: NotificationService, private userService: UserService, private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
      this.authService.setIsAuthentic(true);
    }
    this.initForm();
    this.token = this.route.snapshot.paramMap.get('token');
  }


  get password() {
    return this.form.get('password');
  }


  initForm() {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(this.StrongPasswordRegx)]],
      }
    );
    this.isSubmitted = false;
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    try {
      const payload = {
        token: this.token, newPassword: this.form.value.password
      }
      this.userService.resetPassword(payload).subscribe(user => {
        if (!user?.message) return;
        this.notificationService.showSuccess(user.message);
        this.initForm();
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

}
