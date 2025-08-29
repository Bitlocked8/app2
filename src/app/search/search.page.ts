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
  modalEnvioAbierto = false;
  productoSeleccionado: ItemCarrito | null = null;
  modalSeleccionAbierto = false;
  productosSeleccionados: (ItemCarrito & { seleccionado: boolean })[] = [];
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


  abrirModalEnvio(item: ItemCarrito) {
    this.productoSeleccionado = item;
    this.modalEnvioAbierto = true;
  }

  cerrarModalEnvio() {
    this.modalEnvioAbierto = false;
    this.productoSeleccionado = null;
  }

 abrirModalSeleccion() {
  this.productosSeleccionados = this.carrito
    .filter(p => p.estado === 'Añadido')  // solo los que aún no han sido pagados
    .map(p => ({
      ...p,
      producto: { ...p.producto },
      seleccionado: true
    }));

  this.modalSeleccionAbierto = true;
}




  toggleSeleccion(item: ItemCarrito & { seleccionado: boolean }) {
    item.seleccionado = !item.seleccionado;
  }
  procesarSeleccionados(tipoPago: 'parcial' | 'total') {
    const nuevoEstado = tipoPago === 'parcial' ? 'Pago parcial' : 'Pago total';

    const seleccionados = this.productosSeleccionados.filter(p => p.seleccionado);

    seleccionados.forEach(item => {
      // 🔹 Fake: solo actualizamos el estado y mostramos un console.log
      this.carritoService.actualizarEstado(item.producto.id, nuevoEstado);
      console.log(`Producto ${item.producto.nombre} marcado como ${nuevoEstado}`);
    });
    this.cerrarModalSeleccion();

    alert(`Se realizó un pago ${tipoPago} para ${seleccionados.length} producto(s)`);
  }

  comprobanteVisible = false;
  tipoPagoComprobante: 'parcial' | 'total' | null = null;
  archivoComprobante: File | null = null;


  cerrarModalSeleccion() {
    this.modalSeleccionAbierto = false;
    this.productosSeleccionados = [];
    this.comprobanteVisible = false;
    this.tipoPagoComprobante = null;
    this.archivoComprobante = null;
  }

  getTotalSeleccion(): number {
    return this.productosSeleccionados
      .filter(p => p.seleccionado)
      .reduce((sum, p) => sum + p.precioTotal, 0);
  }

  mostrarComprobante(tipo: 'parcial' | 'total') {
    this.tipoPagoComprobante = tipo;
    this.comprobanteVisible = true;
  }

  archivoSeleccionado(event: any) {
    this.archivoComprobante = event.target.files[0] || null;
  }

  confirmarComprobante() {
    if (!this.archivoComprobante || !this.tipoPagoComprobante) {
      alert('Debes seleccionar un archivo de comprobante.');
      return;
    }

    const nuevoEstado = this.tipoPagoComprobante === 'parcial' ? 'Pago parcial' : 'Pago total';
    const seleccionados = this.productosSeleccionados.filter(p => p.seleccionado);
    seleccionados.forEach(item => {
      this.carritoService.actualizarEstado(item.producto.id, nuevoEstado);
    });

    alert(`Comprobante subido. Estado actualizado a ${nuevoEstado} para ${seleccionados.length} producto(s)`);

    this.comprobanteVisible = false;
    this.tipoPagoComprobante = null;
    this.archivoComprobante = null;
    this.cerrarModalSeleccion();
  }
  abrirModalCompletarPago() {
  const productosParciales = this.carrito
    .filter(p => p.estado === 'Pago parcial')
    .map(p => ({
      ...p,
      producto: { ...p.producto },
      seleccionado: true
    }));

  // Aquí puedes reutilizar el mismo modal de selección, pero con otra lista
  this.productosSeleccionados = productosParciales;
  this.modalSeleccionAbierto = true;
}
modalHistorialAbierto = false;
productosPagados: ItemCarrito[] = [];

abrirModalHistorial() {
  this.productosPagados = this.carrito.filter(p =>
    p.estado === 'Pago parcial' || p.estado === 'Pago total'
  );
  this.modalHistorialAbierto = true;
}

cerrarModalHistorial() {
  this.modalHistorialAbierto = false;
  this.productosPagados = [];
}



}
