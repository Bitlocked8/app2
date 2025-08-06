import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';

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
export class ComprasPage {
  productos = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    nombre: `Agua embotellada ${i + 1}L`,
    precio: (5 + i).toFixed(2),
    imagen: `https://picsum.photos/200/200?random=${i}`,
    vendedor: 'Agua Fresh',
    reputacion: '⭐⭐⭐⭐☆',
  }));

  loadData(event: any) {
    setTimeout(() => {
      const next = this.productos.length;
      this.productos.push(
        ...Array.from({ length: 5 }).map((_, i) => ({
          id: next + i,
          nombre: `Agua embotellada ${next + i + 1}L`,
          precio: (5 + next + i).toFixed(2),
          imagen: `https://picsum.photos/200/200?random=${next + i}`,
          vendedor: 'Agua Fresh',
          reputacion: '⭐⭐⭐⭐☆',
        }))
      );
      event.target.complete();
    }, 1000);
  }
}
