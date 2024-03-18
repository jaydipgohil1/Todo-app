import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  imageUrl = "../../assets/images/istockphoto-1327592506-612x612.jpg"
  isEdit = false;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  userData!: any;
  form!: FormGroup;
  constructor(private fb: FormBuilder, public notificationService: NotificationService, private userService: UserService, private router: Router, private authService: AuthService,) { }

  ngOnInit(): void {
    let data = localStorage.getItem('user')
    if (data) {
      this.userData = JSON.parse(data)
    }
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group(
      {
        name: [this.userData.name || '', Validators.required],
      }
    );
  }

  editToggle = () => this.isEdit = !this.isEdit;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    // if (this.selectedFile) {
    const maxFileSizeMB = 5; // Maximum file size allowed in megabytes
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
    // if (this.selectedFile.size > maxSizeBytes) {
    //   // this.errorMessage = `File size exceeds ${maxFileSizeMB}MB limit.`;
    // } else {
    const formData = new FormData();
    // formData.append('file', this.selectedFile, this.selectedFile.name);
    try {
      this.userService.updateProfile(this.userData._id, this.form.value).subscribe(user => {
        if (!user.data) return
        this.userData.name = this.form.value.name
        this.editToggle()
        localStorage.setItem("user",JSON.stringify(this.userData))
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
    // }
    // } else {
    //   this.errorMessage = 'Please select a file before uploading.';
    // }
  }

}
