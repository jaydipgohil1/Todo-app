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
  showInfo(message: string) {
    this.toastrService.info(message, 'Info', {
      timeOut: 3000,
    });
  }
  showWarning(message: string) {
    this.toastrService.warning(message, 'Warning', {
      timeOut: 3000,
    });
  }
}
