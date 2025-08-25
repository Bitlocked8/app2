import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

import {
  IonContent,
  IonIcon,
  IonButton,
  IonGrid,
  IonBadge,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInfiniteScroll,
  IonSearchbar,
  IonInfiniteScrollContent,
  ModalController
} from '@ionic/angular/standalone';

import { ModalVerCompraProductoComponent } from '../modal-ver-compra-producto/modal-ver-compra-producto.component';
import { ModalVerNotificacionesComponent } from '../modal-ver-notificaciones/modal-ver-notificaciones.component';
import { NotificacionesService } from '../services/notificaciones.service';
import { ProductosService, Producto } from '../services/productos.service';

addIcons({ 'notifications-outline': notificationsOutline });

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonBadge,
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
export class ComprasPage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda = '';
  notificacionesNoLeidas = 0;

  private notiSub!: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private notiService: NotificacionesService,
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    // Suscribirse a notificaciones
    this.notiSub = this.notiService.getObservable().subscribe(notiList => {
      this.notificacionesNoLeidas = notiList.filter(n => !n.leida).length;
    });

    // Obtener productos desde la API
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          imagen: p.imagen
            ? `http://127.0.0.1:8000/storage/${p.imagen}`
            : `https://picsum.photos/200/200?random=${p.id}`,
        }));
        this.productosFiltrados = [...this.productos];
      },
      error: (err) => console.error('Error al traer productos:', err)
    });
  }

  ngOnDestroy() {
    this.notiSub.unsubscribe();
  }

  filtrarProductos() {
    const query = this.busqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(query)
    );
  }

  async verProducto(producto: Producto) {
    const modal = await this.modalCtrl.create({
      component: ModalVerCompraProductoComponent,
      componentProps: { producto },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      showBackdrop: true
    });
    await modal.present();
  }

  async verNotificaciones() {
    const modal = await this.modalCtrl.create({
      component: ModalVerNotificacionesComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5,
      showBackdrop: true
    });
    await modal.present();
  }

  loadData(event: any) {
    // Solo completar scroll infinito
    event.target.complete();
  }
}
