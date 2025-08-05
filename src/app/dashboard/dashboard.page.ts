import { Component, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonLabel,
  IonTabs, IonTabBar, IonTabButton, IonList, IonItem,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, ellipsisVertical, home, water } from 'ionicons/icons';

interface User {
  email: string;
  name: string;
  provider?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonIcon,
    IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonLabel,
    IonTabs, IonTabBar, IonTabButton,
    IonList, IonItem
  ]
})
export class DashboardPage {
  private alertCtrl = inject(AlertController); // 👈 Inyecta AlertController

  private router = inject(Router);
  user: User = { email: '', name: '' };
  showMenu = false;

  constructor() {
    addIcons({ logOut, ellipsisVertical, home, water });

    const authData = localStorage.getItem('fakeAuth');
    if (!authData) {
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }

    this.user = JSON.parse(authData).user;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('fakeAuth');
    this.router.navigate(['/home'], { replaceUrl: true });
    this.showMenu = false;
  }

  openWaterProducts() {
    this.router.navigate(['/products/water']);
    this.showMenu = false;
  }

  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }
}