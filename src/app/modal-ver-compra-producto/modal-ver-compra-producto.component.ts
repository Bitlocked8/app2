import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {
  IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel, IonInput, IonItem, IonBadge
} from '@ionic/angular/standalone';

import { NotificacionesService } from '../services/notificaciones.service';
import { HistorialService } from '../services/historial.service';

@Component({
  selector: 'app-modal-ver-compra-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonButton,
    IonLabel, IonInput, IonItem, IonBadge
  ],
  templateUrl: './modal-ver-compra-producto.component.html',
  styleUrls: ['./modal-ver-compra-producto.component.scss'],
})
export class ModalVerCompraProductoComponent implements OnInit {
  @Input() producto: any;

  productoSeleccionado = {
    cantidad: 1,
  };

  metodoPago: string = 'despues';
  metodoPagoAhora: string = '';
  comprobanteSubido: boolean = false;

  constructor(
    private notiService: NotificacionesService,
    private historialService: HistorialService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.producto.imagen = this.getImagenUrl(this.producto.imagen);
  }

  // Método helper
  getImagenUrl(imagen: string | null): string {
    if (!imagen) return `https://picsum.photos/300/300?random=${this.producto.id}`; // fallback
    if (imagen.startsWith('http')) return imagen; // ya es URL absoluta
    if (imagen.startsWith('storage/')) return `http://127.0.0.1:8000/${imagen}`; // path relativo
    return `http://127.0.0.1:8000/storage/${imagen}`; // solo nombre de archivo
  }


  async agregarAlCarrito() {
    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precioReferencia),
      metodoPago: this.metodoPago === 'contado' ? this.metodoPagoAhora : 'pagar después',
      fecha: new Date(),
      cantidad: this.productoSeleccionado.cantidad,
      estado: 'carrito'
    });

    this.notiService.agregar(
      `Producto "${this.producto.nombre}" añadido al carrito.`,
      'carrito'
    );

    const toast = await this.toastCtrl.create({
      message: 'Producto añadido al carrito.',
      duration: 2000,
      color: 'success',
      position: 'bottom',
      icon: 'cart'
    });
    await toast.present();
  }

  async hacerPedido() {
    const estadoFinal = this.metodoPago === 'contado' ? 'pagado' : 'pendiente';

    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precioReferencia),
      metodoPago: this.metodoPagoAhora,
      fecha: new Date(),
      cantidad: this.productoSeleccionado.cantidad,
      estado: estadoFinal
    });

    this.notiService.agregar(
      estadoFinal === 'pagado'
        ? `Pago confirmado para "${this.producto.nombre}".`
        : `Pedido realizado para "${this.producto.nombre}", pendiente de pago.`,
      estadoFinal === 'pagado' ? 'pagado' : 'pendiente'
    );

    const toast = await this.toastCtrl.create({
      message: estadoFinal === 'pagado'
        ? 'Compra realizada y pagada con éxito.'
        : 'Pedido realizado, pendiente de pago.',
      duration: 2000,
      color: 'success',
      position: 'bottom',
      icon: 'checkmark-done-outline'
    });
    await toast.present();
  }

  onComprobanteSubido(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.comprobanteSubido = true;
      console.log('Comprobante subido:', file.name);
    }
  }

  get precioTotal(): string {
    const precioUnitario = parseFloat(this.producto.precioReferencia);
    const cantidad = this.productoSeleccionado.cantidad;
    const total = precioUnitario * cantidad;
    return `${total.toFixed(2)} Bs.`;
  }
}
