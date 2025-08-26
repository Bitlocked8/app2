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
    if (!imagen) return `https://picsum.photos/300/300?random=${this.producto.id}`;
    if (imagen.startsWith('http')) return imagen;
    if (imagen.startsWith('storage/')) return `http://127.0.0.1:8000/${imagen}`;
    return `http://127.0.0.1:8000/storage/${imagen}`;
  }

  async agregarAlCarrito() {
    const cantidadSeleccionada = this.productoSeleccionado.cantidad;

    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precioReferencia),
      metodoPago: 'pagar después',
      fecha: new Date(),
      cantidad: cantidadSeleccionada,
      estado: 'carrito'
    });

    this.notiService.agregar(
      this.producto.nombre,
      'carrito',
      cantidadSeleccionada,
      this.producto.id
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
