import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { notificationsOutline, addOutline, removeOutline, closeOutline, cartOutline } from 'ionicons/icons';
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
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonText,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';

import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { ProductosService, Producto } from '../services/productos.service';

addIcons({ 
  'notifications-outline': notificationsOutline,
  'add-outline': addOutline,
  'remove-outline': removeOutline,
  'close-outline': closeOutline,
  'cart-outline': cartOutline
});

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  observaciones: string;
  precioTotal: number;
  fecha: Date;
}

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
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonInput,
    IonText,
    IonItem,
    IonLabel,
    IonList
  ],
})
export class ComprasPage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda = '';
  notificacionesNoLeidas = 0;
  
  // Modales
  modalProductoAbierto = false;
  modalNotificacionesAbierto = false;
  
  // Carrito y selección
  productoSeleccionado: Producto | null = null;
  cantidad: number = 1;
  observaciones: string = '';
  carrito: ItemCarrito[] = [];
  mostrarCarrito: boolean = false;
  // Notificaciones
  notificaciones: Notificacion[] = [];

  private notiSub!: Subscription;

  constructor(
    private notiService: NotificacionesService,
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    // Suscribirse a notificaciones
    this.notiSub = this.notiService.getObservable().subscribe(notiList => {
      this.notificaciones = notiList;
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

  // Modal de producto
  abrirModalProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.cantidad = 1;
    this.observaciones = '';
    this.modalProductoAbierto = true;
  }

  cerrarModalProducto() {
    this.modalProductoAbierto = false;
    this.productoSeleccionado = null;
  }

  // Modal de notificaciones
  abrirModalNotificaciones() {
    this.modalNotificacionesAbierto = true;
  }

  cerrarModalNotificaciones() {
    this.modalNotificacionesAbierto = false;
  }

  // Control de cantidad
  incrementarCantidad() {
    this.cantidad++;
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  // Función para convertir precio de string a número
  obtenerPrecioNumerico(precio: string): number {
    return parseFloat(precio) || 0;
  }

  // Calcular el precio total
  calcularPrecioTotal(): number {
    if (!this.productoSeleccionado) return 0;
    return this.obtenerPrecioNumerico(this.productoSeleccionado.precioReferencia) * this.cantidad;
  }

  // Agregar al carrito
  agregarAlCarrito() {
    if (this.productoSeleccionado) {
      const item: ItemCarrito = {
        producto: this.productoSeleccionado,
        cantidad: this.cantidad,
        observaciones: this.observaciones,
        precioTotal: this.calcularPrecioTotal(),
        fecha: new Date()
      };

      this.carrito.push(item);
      
      // Agregar notificación
      this.notiService.agregar(
        this.productoSeleccionado.nombre,
        'carrito',
        this.cantidad,
        this.productoSeleccionado.id
      );

      // Cerrar el modal después de añadir
      this.cerrarModalProducto();
    }
  }

  // Marcar notificación como leída
  marcarComoLeida(notificacion: Notificacion) {
    this.notiService.marcarComoLeida(notificacion.id);
  }

  // Limpiar notificaciones
  limpiarNotificaciones() {
    this.notiService.limpiar();
  }

  // Obtener total del carrito
  getTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.precioTotal, 0);
  }
  // Método para mostrar el resumen del carrito por 3 segundos
mostrarResumenCarrito() {
  this.mostrarCarrito = true;

  setTimeout(() => {
    this.mostrarCarrito = false;
  }, 3000); // desaparece después de 3 segundos
}


  loadData(event: any) {
    event.target.complete();
  }
}