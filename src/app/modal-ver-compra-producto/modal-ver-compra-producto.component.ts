import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel,
  IonInput, IonItem, IonSelect, IonSelectOption, IonBadge,
  IonCard, IonCardContent, IonAccordionGroup, IonAccordion
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-ver-compra-producto',
  standalone: true,
  imports: [
    CommonModule,FormsModule,
    IonContent, IonGrid, IonRow, IonCol, IonButton, IonLabel,
    IonInput, IonItem, IonSelect, IonSelectOption, IonBadge,
    IonCard, IonCardContent, IonAccordionGroup, IonAccordion
  ],
  templateUrl: './modal-ver-compra-producto.component.html',
  styleUrls: ['./modal-ver-compra-producto.component.scss'],
})
export class ModalVerCompraProductoComponent {
  
  @Input() producto: any;

  productoSeleccionado = {
    color: '',
    bundle: '',
    enchufe: '',
    cantidad: 1,
  };

  cerrar() {
    // Implementa cierre del modal
  }

  agregarAlCarrito() {
    console.log('Añadido al carrito:', this.productoSeleccionado);
  }

  hacerPedido() {
    console.log('Pedido realizado con:', this.productoSeleccionado);
  }

  verTodosLosComentarios() {
    console.log('Ver todos los comentarios');
  }
  
}
