import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import {
  IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel, IonSegment, IonSegmentButton,  IonSelect,IonText,
  IonSelectOption,
  IonInput, IonItem, IonBadge, IonAccordionGroup, IonAccordion, IonList, IonRadioGroup, IonRadio, IonListHeader
} from '@ionic/angular/standalone';

import { NotificacionesService } from '../services/notificaciones.service';

@Component({
  selector: 'app-modal-ver-compra-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonSegment, IonSegmentButton,  IonSelect,
  IonSelectOption,IonText,
    IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel,
    IonInput, IonItem, IonBadge, IonAccordionGroup, IonAccordion,
    IonList, IonRadioGroup, IonRadio, IonListHeader
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

  metodoPago: string = 'despues'; // Valor inicial: pagar después
  metodoPagoAhora: string = '';
  pagoDespuesDatos = {
    email: '',
    telefono: '',
  };

  precioOriginalCalculado = 0;
  precioAhorroCalculado = 0;

  constructor(
    private notiService: NotificacionesService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.calcularPrecioAnteriorYDescuento();
  }

  calcularPrecioAnteriorYDescuento() {
    const porcentajeAumento = Math.floor(Math.random() * 15) + 10; // 10% a 25%
    const precioActual = parseFloat(this.producto?.precio ?? '0');

    this.precioOriginalCalculado = +(precioActual * (1 + porcentajeAumento / 100)).toFixed(2);
    this.precioAhorroCalculado = +(this.precioOriginalCalculado - precioActual).toFixed(2);
  }

  cerrar() {
    console.log('Modal cerrado');
  }

  async agregarAlCarrito() {
    console.log('Añadido al carrito:', this.productoSeleccionado);

    this.notiService.agregar(
      `Producto "${this.producto.nombre}" añadido al carrito, cantidad: ${this.productoSeleccionado.cantidad}.`,
      'carrito'  // tipo carrito
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
    console.log('Pedido realizado con:', this.productoSeleccionado);

    await this.notiService.agregar(
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

  verTodosLosComentarios() {
    console.log('Ver todos los comentarios');
  }
  onComprobanteSubido(event: any) {
  const file = event.target.files[0];
  if (file) {
    console.log('Comprobante subido:', file.name);
  }
}

  get precioTotal(): string {
    const precioUnitario = parseFloat(this.producto.precio);
    const cantidad = this.productoSeleccionado.cantidad;
    let descuento = 0;

    if (cantidad >= 10) {
      descuento += 0.10;
    }

    const hoy = new Date();
    const eventos: { [key: string]: number } = {
      '12-25': 0.20,
      '01-01': 0.15,
    };
    const key = hoy.toISOString().slice(5, 10);
    if (eventos[key]) {
      descuento += eventos[key];
    }

    const total = precioUnitario * cantidad * (1 - descuento);
    return `${total.toFixed(2)} Bs.`;
  }

  get descuentoAplicado(): string {
    const cantidad = this.productoSeleccionado.cantidad;
    let descuento = 0;

    if (cantidad >= 10) {
      descuento += 10;
    }

    const hoy = new Date().toISOString().slice(5, 10);
    if (hoy === '12-25') {
      descuento += 20;
    } else if (hoy === '01-01') {
      descuento += 15;
    }

    return descuento > 0 ? `-${descuento}% de descuento aplicado` : '';
  }
}
