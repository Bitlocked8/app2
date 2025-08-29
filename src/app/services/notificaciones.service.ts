import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  productoId?: number;       // para identificar el producto
  mensaje: string;           // solo nombre del producto
  tipo: string;              // 'carrito', 'pagado', etc.
  fecha: Date;
  leida: boolean;
  cantidad?: number;         // cantidad añadida
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificaciones: Notificacion[] = [];
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);

  constructor() {}

  /**
   * Agrega una nueva notificación.
   * Si ya existe una del mismo producto y tipo 'carrito', acumula la cantidad.
   */
 agregar(mensaje: string, tipo: string, cantidad: number, productoId?: number) {
    if (productoId && tipo === 'carrito') {
      // Buscar si ya existe notificación de este producto
      const existente = this.notificaciones.find(
        n => n.productoId === productoId && n.tipo === 'carrito'
      );
      if (existente) {
        existente.cantidad! += cantidad;
        existente.fecha = new Date(); // actualizar fecha
        this.notificacionesSubject.next(this.notificaciones);
        return;
      }
    }

    // Crear nueva notificación
    const nueva: Notificacion = {
      id: Date.now(),
      productoId,
      mensaje,
      tipo,
      fecha: new Date(),
      leida: false,
      cantidad
    };

    // Insertar al inicio del arreglo
    this.notificaciones.unshift(nueva);
    this.notificacionesSubject.next(this.notificaciones);
  }

  /**
   * Retorna un Observable de las notificaciones
   */
  getObservable(): Observable<Notificacion[]> {
    return this.notificacionesSubject.asObservable();
  }

  /**
   * Marca una notificación como leída
   */
  marcarComoLeida(id: number) {
    const noti = this.notificaciones.find(n => n.id === id);
    if (noti) {
      noti.leida = true;
      this.notificacionesSubject.next(this.notificaciones);
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  limpiar() {
    this.notificaciones = [];
    this.notificacionesSubject.next([]);
  }
}
