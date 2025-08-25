import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz con los campos que devuelve tu API
export interface Producto {
  id: number;
  nombre: string;
  imagen: string | null;
  tipoContenido: number;
  tipoProducto: number;
  capacidad: number;
  unidad: string;
  precioReferencia: string;
  precioReferencia2: string | null;
  precioReferencia3: string | null;
  observaciones: string | null;
  base_id: number;
  tapa_id: number;
  estado: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // 👉 aquí va la URL de tu API en Laravel
  private apiUrl = 'http://127.0.0.1:8000/api/productos';

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
