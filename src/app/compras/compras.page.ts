import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';
addIcons({
  'notifications-outline': notificationsOutline,
});
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInfiniteScroll,
  IonSearchbar,
  IonInfiniteScrollContent,
  ModalController // ✅ importado aquí
} from '@ionic/angular/standalone';

import { ModalVerCompraProductoComponent } from '../modal-ver-compra-producto/modal-ver-compra-producto.component'; // ✅ ajusta ruta si es diferente

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class ComprasPage implements OnInit {
  productos = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    nombre: `Agua embotellada ${i + 1}L`,
    precio: (5 + i).toFixed(2),
    imagen: `https://picsum.photos/200/200?random=${i}`,
    vendedor: 'Agua Fresh',
    reputacion: '⭐⭐⭐⭐☆',
  }));

  productosFiltrados: any[] = [];
  busqueda = '';

  // ✅ constructor con ModalController
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.productosFiltrados = [...this.productos];
  }

  filtrarProductos() {
    const query = this.busqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(query)
    );
  }

  loadData(event: any) {
    setTimeout(() => {
      const next = this.productos.length;
      const nuevos = Array.from({ length: 5 }).map((_, i) => ({
        id: next + i,
        nombre: `Agua embotellada ${next + i + 1}L`,
        precio: (5 + next + i).toFixed(2),
        imagen: `https://picsum.photos/200/200?random=${next + i}`,
        vendedor: 'Agua Fresh',
        reputacion: '⭐⭐⭐⭐☆',
      }));

      this.productos.push(...nuevos);
      this.filtrarProductos();
      event.target.complete();
    }, 1000);
  }

  verNotificaciones() {
    console.log('🔔 Ver notificaciones');
  }

  // ✅ Método para abrir modal con ficha técnica
  async verProducto(producto: any) {
    const modal = await this.modalCtrl.create({
      component: ModalVerCompraProductoComponent,
      componentProps: {
        producto: producto
      },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      showBackdrop: true
    });

    await modal.present();
  }
}
