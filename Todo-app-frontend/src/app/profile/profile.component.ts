import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  imageUrl = "../../assets/images/istockphoto-1327592506-612x612.jpg"
  isEdit = true;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  editToggle = () => this.isEdit = !this.isEdit;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      const maxFileSizeMB = 5; // Maximum file size allowed in megabytes
      const maxSizeBytes = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
      if (this.selectedFile.size > maxSizeBytes) {
        // this.errorMessage = `File size exceeds ${maxFileSizeMB}MB limit.`;
      } else {
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        // this.http.post<any>('http://localhost:3000/upload', formData).subscribe(
        //   (response) => {
        //     console.log('File uploaded successfully', response);
        //   },
        //   (error) => {
        //     console.error('Error uploading file', error);
        //   }
        // );
      }
    } else {
      this.errorMessage = 'Please select a file before uploading.';
    }
  }

}
