import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {
  IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel,
  IonInput, IonItem, IonSelect, IonSelectOption, IonBadge,
  IonCard, IonCardContent, IonAccordionGroup, IonAccordion
} from '@ionic/angular/standalone';

// Importa tu servicio aquí
import { NotificacionesService } from '../services/notificaciones.service';

@Component({
  selector: 'app-modal-ver-compra-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel,
    IonInput, IonItem, IonSelect, IonSelectOption, IonBadge,
    IonCard, IonCardContent, IonAccordionGroup, IonAccordion
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

  // ...imports y demás...

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
      'pagado'  // tipo pagado
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
