import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(public toastrService: ToastrService) { }

  showSuccess(message: string) {
    this.toastrService.success(message, 'Success', {
      timeOut: 3000,
    });
  }
  showError(message: string) {
    this.toastrService.error(message, 'Error:', {
      timeOut: 3000,
    });
  }
}
