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

  // Modal de Pago
  modalPagoAbierto = false;
  productosSeleccionadosPago: (ItemCarrito & { seleccionado?: boolean; estado?: string })[] = [];

  private carritoSub!: Subscription;
  private notiSub!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private notiService: NotificacionesService
  ) { }

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

  // Modal Envío
  abrirModalEnvio(item: ItemCarrito) {
    this.productoSeleccionado = item;
    this.modalEnvioAbierto = true;
  }

  cerrarModalEnvio() {
    this.modalEnvioAbierto = false;
    this.productoSeleccionado = null;
  }

  // Modal Pago
  abrirModalPago(productos: ItemCarrito[]) {
    this.productosSeleccionadosPago = productos.map(p => ({ ...p, seleccionado: false }));
    this.modalPagoAbierto = true;
  }

  cerrarModalPago() {
    this.modalPagoAbierto = false;
    this.productosSeleccionadosPago = [];
  }

procesarPago(tipo: 'parcial' | 'total') {
  const seleccionados = this.productosSeleccionadosPago.filter(p => p.seleccionado);

  seleccionados.forEach(p => {
    p.estado = tipo === 'parcial' ? 'Pago parcial' : 'Pago total';

    // Nombre seguro del producto
    const nombreProducto: string = p.producto.nombre ?? 'Producto sin nombre';

    // Id seguro del producto
    const idProducto: number | undefined = p.producto.id ?? undefined;

    // Notificación
    this.notiService.agregar(
      nombreProducto,
      tipo === 'parcial' ? 'pago parcial' : 'pago total',
      p.cantidad,
      idProducto
    );
  });

  this.cerrarModalPago();
}
abrirModalPagoWrapper() {
  this.abrirModalPago(this.carrito);
}

}
