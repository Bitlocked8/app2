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
    const cantidadSeleccionada = this.productoSeleccionado.cantidad;

    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precioReferencia),
      metodoPago: this.metodoPago === 'contado' ? this.metodoPagoAhora : 'pagar después',
      fecha: new Date(),
      cantidad: cantidadSeleccionada,
      estado: 'carrito'
    });

    // PASAR CANTIDAD Y PRODUCTO ID a la notificación
    this.notiService.agregar(
      this.producto.nombre,  // solo el nombre del producto
      'carrito',             // tipo de notificación
      cantidadSeleccionada,   // cantidad añadida
      this.producto.id        // ID del producto
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

  get precioTotal(): string {
    const precioUnitario = parseFloat(this.producto.precioReferencia);
    const cantidad = this.productoSeleccionado.cantidad;
    const total = precioUnitario * cantidad;
    return `${total.toFixed(2)} Bs.`;
  }
}
