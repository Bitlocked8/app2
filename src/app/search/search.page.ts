import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonButton
} from '@ionic/angular/standalone';

import { CarritoService, ItemCarrito } from '../services/carrito.service';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonButton, // <-- Aquí agregas IonButton
  ],
})
export class SearchPage implements OnInit, OnDestroy {
  carrito: ItemCarrito[] = [];
  notificaciones: Notificacion[] = [];

  private carritoSub!: Subscription;
  private notiSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private notiService: NotificacionesService
  ) {}

  ngOnInit() {
    this.carritoSub = this.carritoService.carrito$.subscribe(items => {
      this.carrito = items;
    });

    this.notiSub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti;
    });
  }

  ngOnDestroy() {
    this.carritoSub?.unsubscribe();
    this.notiSub?.unsubscribe();
  }

  getTotalCarrito(): number {
    return this.carritoService.total();
  }
}
