import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { ConfirmPasswordValidator } from './validation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registrationForm!: FormGroup;
  isSubmitted = false;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(private fb: FormBuilder, public notificationService: NotificationService, private userService: UserService,) { }

  ngOnInit(): void {
    this.initForm();

  }

  get fullName() {
    return this.registrationForm.get('fullName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(this.StrongPasswordRegx)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(10)],],
      },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      }
    );
    this.isSubmitted = false;
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registrationForm.invalid) return;
    try {
      const payload = {
        name: this.registrationForm.value.fullName,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password
      }

      this.userService.register(payload).subscribe((user) => {
        if (!user.data) return;
        this.notificationService.showSuccess('Registration Successfully!');
        this.initForm();
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }
}
