import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Compra {
  producto: string;
  imagen: string;
  precio: number;
  metodoPago: string;
  fecha: Date;
  cantidad: number;
  estado: 'carrito' | 'pendiente' | 'enviado' | 'recibido';
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private compras: Compra[] = [];
  private comprasSubject = new BehaviorSubject<Compra[]>([]);

  compras$ = this.comprasSubject.asObservable(); // observable público

  addCompra(compra: Compra) {
    this.compras.push(compra);
    this.comprasSubject.next([...this.compras]); // notificar a los suscriptores
  }

  getCompras(): Compra[] {
    return [...this.compras];
  }

  actualizarEstado(producto: string, nuevoEstado: Compra['estado']) {
    const item = this.compras.find(c => c.producto === producto && c.estado !== 'recibido');
    if (item) item.estado = nuevoEstado;
    this.comprasSubject.next([...this.compras]); // actualizar también aquí
  }
}
