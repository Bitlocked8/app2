import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
})
export class HomePage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

login() {
  if (!this.email || !this.password) {
    this.errorMessage = 'Completa todos los campos';
    return;
  }

  this.isLoading = true;
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = err.error.message || 'Error en el login';
      this.isLoading = false;
    }
  });
}


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
