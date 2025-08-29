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
  IonButton,
  IonModal
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
    IonButton,
    IonModal
  ],
})
export class SearchPage implements OnInit, OnDestroy {
  carrito: ItemCarrito[] = [];
  notificaciones: Notificacion[] = [];

  // Modal de Envío
  modalEnvioAbierto = false;
  productoSeleccionado: ItemCarrito | null = null;

  private carritoSub!: Subscription;
  private notiSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private notiService: NotificacionesService
  ) { }

  ngOnInit() {
    this.carritoSub = this.carritoService.carrito$.subscribe(items => {
      this.carrito = items || [];
    });

    this.notiSub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti || [];
    });
  }

  ngOnDestroy() {
    this.carritoSub?.unsubscribe();
    this.notiSub?.unsubscribe();
  }

  getTotalCarrito(): number {
    return this.carritoService.total();
  }

  // Modal Envío
  abrirModalEnvio(item: ItemCarrito) {
    this.productoSeleccionado = item;
    this.modalEnvioAbierto = true;
  }

  cerrarModalEnvio() {
    this.modalEnvioAbierto = false;
    this.productoSeleccionado = null;
  }
}
