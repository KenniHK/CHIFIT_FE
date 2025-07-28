import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

interface LoginResponse {
  token: string;
  role: string;
  name: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: LoginResponse) => {
        this.auth.saveToken(res.token);
        localStorage.setItem('name', res.name); 

        console.log('ROLE:', res.role);
        


        if (res.role === 'admin') {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/dashboard-user']);
        }
      },
      error: (err) => {
        this.error = err.error.message || 'Login gagal';
      },
    });
  }
}
