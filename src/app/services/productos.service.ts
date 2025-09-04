import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://127.0.0.1:8000/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener productos incluyendo token
  getProductos(): Observable<Producto[]> {
    const token = localStorage.getItem('authToken'); // Token guardado después del login
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    return this.http.get<Producto[]>(this.apiUrl, { headers });
  }
}
