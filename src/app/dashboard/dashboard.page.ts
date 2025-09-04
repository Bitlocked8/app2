import { Component, HostListener, inject } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cart, search, logOut, home, water } from 'ionicons/icons';
import { AuthService } from '../services/auth.service'; // <- Importa el servicio

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class DashboardPage {
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private authService = inject(AuthService); // <- Inyecta AuthService

  user: any = { email: '', name: '' };

  constructor() {
    addIcons({ cart, search, logOut, home, water });
    this.checkAuth();
    history.pushState(null, '', location.href); // Bloquea atrás desde la entrada
  }

  private checkAuth() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.user = this.authService.getUser();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    if (this.router.url.startsWith('/dashboard') && this.authService.isAuthenticated()) {
      history.pushState(null, '', location.href);
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres salir?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Salir', 
          handler: () => {
            this.authService.logout(); // <- Limpia token y user
            this.router.navigate(['/home'], { replaceUrl: true });
          } 
        }
      ]
    });

    await alert.present();
  }
}
