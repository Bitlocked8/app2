import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonAvatar,
  IonGrid, IonRow, IonCol, IonButton, IonList, IonText, IonButtons,
  IonModal, IonIcon, IonCheckbox
} from '@ionic/angular/standalone';
import { HistorialService, Compra } from '../services/historial.service';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { Subscription } from 'rxjs';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonButton,
    IonList,
    IonText,
    IonModal,
    IonIcon,
    IonCheckbox
  ]
})
export class SearchPage implements OnInit, OnDestroy {
  compras: Compra[] = [];
  notificaciones: Notificacion[] = [];
  private comprasSub!: Subscription;
  private notiSub!: Subscription;

  selectedCompra: Compra | null = null; 
  pagoModalOpen = false;

  constructor(
    private historialService: HistorialService,
    private notiService: NotificacionesService
  ) {}

  ngOnInit() {
    this.comprasSub = this.historialService.compras$.subscribe(c => this.compras = c);
    this.notiSub = this.notiService.getObservable().subscribe(noti => this.notificaciones = noti);
  }

  ngOnDestroy() {
    this.comprasSub?.unsubscribe();
    this.notiSub?.unsubscribe();
  }

  totalCompra(compra: Compra): number {
    return compra.precio * compra.cantidad;
  }

  totalSeleccionado(): number {
    return this.compras
      .filter(c => c.seleccionado)
      .reduce((sum, c) => sum + this.totalCompra(c), 0);
  }

  getTimeline(compra: Compra) {
    return [
      { label: 'Falta pagar', done: ['pagado', 'enviado', 'recibido'].includes(compra.estado) },
      { label: 'Pago realizado', done: ['pagado', 'enviado', 'recibido'].includes(compra.estado) },
      { label: 'Empaquetado', done: ['enviado', 'recibido'].includes(compra.estado) },
      { label: 'Enviado', done: ['enviado', 'recibido'].includes(compra.estado) },
      { label: 'Recibido', done: compra.estado === 'recibido' }
    ];
  }

  getNotificaciones(compra: Compra) {
    return this.notificaciones.filter(n => n.mensaje.includes(compra.producto));
  }

  setOpen(isOpen: boolean, compra?: Compra) {
    this.selectedCompra = isOpen && compra ? compra : null;
  }

  openPagoModal() {
    this.compras.forEach(c => c.seleccionado = true);
    this.pagoModalOpen = true;
  }

  pagar(metodo: 'qr' | 'tarjeta') {
    const seleccionados = this.compras.filter(c => c.seleccionado);
    if (seleccionados.length === 0) {
      alert('Selecciona al menos un producto para pagar');
      return;
    }
    console.log('Pagando con', metodo, seleccionados);
    this.pagoModalOpen = false;
  }
}
