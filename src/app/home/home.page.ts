import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class HomePage {
  // Todas las propiedades deben estar declaradas aquí
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  user: any; // Si planeas usarla

  private fakeUsers = [
    { email: 'admin@demo.com', password: 'admin123', name: 'Administrador' },
    { email: 'user@demo.com', password: 'user123', name: 'Usuario Demo' }
  ];

  constructor(private router: Router) {}

  async login() {
    this.isLoading = true;
    this.errorMessage = '';

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      this.isLoading = false;
      return;
    }

    const user = this.fakeUsers.find(u => 
      u.email === this.email.toLowerCase() && 
      u.password === this.password
    );

    if (user) {
      localStorage.setItem('fakeAuth', JSON.stringify({
        isAuthenticated: true,
        user: {
          email: user.email,
          name: user.name
        }
      }));
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }

    this.isLoading = false;
  }

  loginWithGoogle() {
    this.isLoading = true;
    setTimeout(() => {
      localStorage.setItem('fakeAuth', JSON.stringify({
        isAuthenticated: true,
        user: {
          email: 'google-user@demo.com',
          name: 'Usuario Google',
          provider: 'google'
        }
      }));
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 1500);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}