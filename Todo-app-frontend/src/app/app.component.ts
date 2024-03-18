import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Todo-app-frontend';
  isLogin: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isAuthentic$.subscribe(auth => {
      this.isLogin = auth;
    })
    this.isLogin = localStorage.getItem('token') ? true : false;
  }
}
