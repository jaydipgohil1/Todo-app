import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  isLogin: boolean = true;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.isAuthentic$.subscribe(auth => {
      this.isLogin = auth;
    })
    this.isLogin = localStorage.getItem('token') ? true : false;
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
    this.authService.setIsAuthentic(false);
  }

}
