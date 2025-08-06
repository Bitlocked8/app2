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

interface User {
  email: string;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: 'dashboard.page.html',
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class DashboardPage {
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  user: User = { email: '', name: '' };

  constructor() {
    addIcons({ cart, search, logOut, home, water });
    this.checkAuth();
  }

  private checkAuth() {
    const authData = localStorage.getItem('fakeAuth');
    if (!authData) {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.user = JSON.parse(authData).user;
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: () => {
            localStorage.removeItem('fakeAuth');
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }
}