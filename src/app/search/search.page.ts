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
  IonModal,
  IonCheckbox
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
    IonModal,
    IonCheckbox
  ],
})
export class SearchPage implements OnInit, OnDestroy {
  carrito: ItemCarrito[] = [];
  notificaciones: Notificacion[] = [];

  // Modal de Envío
  modalEnvioAbierto = false;
  productoSeleccionado: ItemCarrito | null = null;

  // Modal de Selección de productos
  modalSeleccionAbierto = false;
  productosSeleccionados: (ItemCarrito & { seleccionado: boolean })[] = [];

  private carritoSub!: Subscription;
  private notiSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private notiService: NotificacionesService
  ) {}

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

  // Modal Selección de todos los productos
  abrirModalSeleccion() {
    this.productosSeleccionados = this.carrito.map(p => ({
      ...p,
      producto: { ...p.producto },
      seleccionado: true
    }));
    this.modalSeleccionAbierto = true;
  }

  cerrarModalSeleccion() {
    this.modalSeleccionAbierto = false;
    this.productosSeleccionados = [];
  }

  toggleSeleccion(item: ItemCarrito & { seleccionado: boolean }) {
    item.seleccionado = !item.seleccionado;
  }

  getTotalSeleccion(): number {
    return this.productosSeleccionados
      .filter(p => p.seleccionado)
      .reduce((sum, p) => sum + p.precioTotal, 0);
  }
  procesarSeleccionados(tipoPago: 'parcial' | 'total') {
  const nuevoEstado = tipoPago === 'parcial' ? 'Pago parcial' : 'Pago total';

  const seleccionados = this.productosSeleccionados.filter(p => p.seleccionado);

  seleccionados.forEach(item => {
    // 🔹 Fake: solo actualizamos el estado y mostramos un console.log
    this.carritoService.actualizarEstado(item.producto.id, nuevoEstado);
    console.log(`Producto ${item.producto.nombre} marcado como ${nuevoEstado}`);
  });

  // Cerramos el modal simulando que ya se completó el pago
  this.cerrarModalSeleccion();

  // Opcional: mostrar un toast/fake alert
  alert(`Se realizó un pago ${tipoPago} para ${seleccionados.length} producto(s)`);
}

}
