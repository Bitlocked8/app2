import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {
  IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel, IonSegment, IonSegmentButton,
  IonSelect, IonText, IonSelectOption, IonInput, IonItem, IonBadge, IonAccordionGroup,
  IonAccordion, IonList
} from '@ionic/angular/standalone';

import { NotificacionesService } from '../services/notificaciones.service';
import { HistorialService, Compra } from '../services/historial.service';

@Component({
  selector: 'app-modal-ver-compra-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonSegment, IonSegmentButton, IonSelect,
    IonSelectOption, IonText, IonContent, IonGrid, IonRow, IonCol, IonButton,
    IonLabel, IonInput, IonItem, IonBadge, IonAccordionGroup, IonAccordion, IonList
  ],
  templateUrl: './modal-ver-compra-producto.component.html',
  styleUrls: ['./modal-ver-compra-producto.component.scss'],
})
export class ModalVerCompraProductoComponent implements OnInit {
  @Input() producto: any;

  productoSeleccionado = {
    color: '',
    bundle: '',
    enchufe: '',
    cantidad: 1,
  };

  metodoPago: string = 'despues';
  metodoPagoAhora: string = '';
  pagoDespuesDatos = { email: '', telefono: '' };

  precioOriginalCalculado = 0;
  precioAhorroCalculado = 0;

  comprobanteSubido: boolean = false;

  constructor(
    private notiService: NotificacionesService,
    private historialService: HistorialService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.calcularPrecioAnteriorYDescuento();
  }

  calcularPrecioAnteriorYDescuento() {
    const porcentajeAumento = Math.floor(Math.random() * 15) + 10;
    const precioActual = parseFloat(this.producto?.precio ?? '0');

    this.precioOriginalCalculado = +(precioActual * (1 + porcentajeAumento / 100)).toFixed(2);
    this.precioAhorroCalculado = +(this.precioOriginalCalculado - precioActual).toFixed(2);
  }

  async agregarAlCarrito() {
    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precio),
      metodoPago: this.metodoPago === 'contado' ? this.metodoPagoAhora : 'pagar después',
      fecha: new Date(),
      cantidad: this.productoSeleccionado.cantidad,
      estado: 'carrito'
    });

    this.notiService.agregar(
      `Producto "${this.producto.nombre}" añadido al carrito, cantidad: ${this.productoSeleccionado.cantidad}.`,
      'carrito'
    );

    const toast = await this.toastCtrl.create({
      message: 'Producto añadido al carrito correctamente.',
      duration: 2000,
      color: 'success',
      position: 'bottom',
      icon: 'cart'
    });
    await toast.present();
  }

  async hacerPedido() {
    if (!this.comprobanteSubido) {
      const toast = await this.toastCtrl.create({
        message: 'Debes subir el comprobante antes de comprar.',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
      await toast.present();
      return;
    }

    this.historialService.addCompra({
      producto: this.producto.nombre,
      imagen: this.producto.imagen,
      precio: parseFloat(this.producto.precio),
      metodoPago: this.metodoPagoAhora,
      fecha: new Date(),
      cantidad: this.productoSeleccionado.cantidad,
      estado: 'pendiente'
    });

    this.notiService.agregar(
      `Pedido realizado con éxito para "${this.producto.nombre}".`,
      'pagado'
    );

    const toast = await this.toastCtrl.create({
      message: 'Pedido realizado con éxito.',
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
    const precioUnitario = parseFloat(this.producto.precio);
    const cantidad = this.productoSeleccionado.cantidad;
    let descuento = 0;

    if (cantidad >= 10) descuento += 0.10;

    const hoy = new Date();
    const eventos: { [key: string]: number } = { '12-25': 0.20, '01-01': 0.15 };
    const key = hoy.toISOString().slice(5, 10);
    if (eventos[key]) descuento += eventos[key];

    const total = precioUnitario * cantidad * (1 - descuento);
    return `${total.toFixed(2)} Bs.`;
  }

  get descuentoAplicado(): string {
    const cantidad = this.productoSeleccionado.cantidad;
    let descuento = 0;

    if (cantidad >= 10) descuento += 10;

    const hoy = new Date().toISOString().slice(5, 10);
    if (hoy === '12-25') descuento += 20;
    else if (hoy === '01-01') descuento += 15;

    return descuento > 0 ? `-${descuento}% de descuento aplicado` : '';
  }

  verTodosLosComentarios() {
    console.log('Ver todos los comentarios');
  }
}
