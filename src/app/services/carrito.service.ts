import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './productos.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  observaciones: string;
  precioTotal: number;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: ItemCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  agregar(item: ItemCarrito) {
    this.carrito.push(item);
    this.carritoSubject.next([...this.carrito]);
  }

  obtener(): ItemCarrito[] {
    return [...this.carrito];
  }

  limpiar() {
    this.carrito = [];
    this.carritoSubject.next([]);
  }

  total(): number {
    return this.carrito.reduce((sum, i) => sum + i.precioTotal, 0);
  }
}
