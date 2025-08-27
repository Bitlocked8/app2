import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Compra {
  producto: string;
  imagen: string;
  precio: number;
  metodoPago: string;
  fecha: Date;
  cantidad: number;
  estado: 'carrito' | 'pendiente' | 'pagado' | 'enviado' | 'recibido';
  
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private compras: Compra[] = [];
  private comprasSubject = new BehaviorSubject<Compra[]>([]);

  compras$ = this.comprasSubject.asObservable(); // observable público

  addCompra(compra: Compra) {
    // Si ya existe en carrito, sumamos cantidad
    const existente = this.compras.find(c => c.producto === compra.producto && c.estado === 'carrito');
    if (existente) {
      existente.cantidad += compra.cantidad;
    } else {
      this.compras.push(compra);
    }
    this.comprasSubject.next([...this.compras]); // notificar
  }

  getCompras(): Compra[] {
    return [...this.compras];
  }

  actualizarEstado(producto: string, nuevoEstado: Compra['estado'], fecha?: Date) {
    const item = fecha 
      ? this.compras.find(c => c.producto === producto && c.fecha.getTime() === fecha.getTime())
      : this.compras.find(c => c.producto === producto && c.estado !== 'recibido');
    
    if (item) {
      item.estado = nuevoEstado;
      this.comprasSubject.next([...this.compras]);
    }
  }

  eliminarCompra(producto: string, fecha: Date) {
    this.compras = this.compras.filter(c => !(c.producto === producto && c.fecha.getTime() === fecha.getTime()));
    this.comprasSubject.next([...this.compras]);
  }

  vaciarCarrito() {
    this.compras = this.compras.filter(c => c.estado !== 'carrito');
    this.comprasSubject.next([...this.compras]);
  }
}
