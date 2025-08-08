import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'info' | 'success' | 'error';
  fecha: Date;
  leida: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificaciones: Notificacion[] = [];
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);

  constructor() {}

  agregar(mensaje: string, tipo: 'info' | 'success' | 'error' = 'info') {
    const nueva: Notificacion = {
      id: Date.now(),
      mensaje,
      tipo,
      fecha: new Date(),
      leida: false
    };

    this.notificaciones.unshift(nueva);
    this.notificacionesSubject.next(this.notificaciones);
  }

  getObservable(): Observable<Notificacion[]> {
    return this.notificacionesSubject.asObservable();
  }

  marcarComoLeida(id: number) {
    const noti = this.notificaciones.find(n => n.id === id);
    if (noti) {
      noti.leida = true;
      this.notificacionesSubject.next(this.notificaciones);
    }
  }

  limpiar() {
    this.notificaciones = [];
    this.notificacionesSubject.next([]);
  }
}
