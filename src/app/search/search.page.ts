import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonAvatar, IonModal, IonButton, IonButtons } from '@ionic/angular/standalone';
import { HistorialService, Compra } from '../services/historial.service';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { Subscription } from 'rxjs';

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
    IonModal,
    IonButton,
    IonButtons,
    DatePipe
  ]
})
export class SearchPage implements OnDestroy {
  compras: Compra[] = [];
  selectedCompra?: Compra;
  notificaciones: Notificacion[] = [];
  notiSub!: Subscription;

  @ViewChild('modal') modal!: IonModal;

  constructor(
    private historialService: HistorialService,
    private notiService: NotificacionesService
  ) {
    this.historialService.compras$.subscribe(c => this.compras = c);

    // Suscripción a notificaciones
    this.notiSub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti;
    });
  }

  ngOnDestroy() {
    this.notiSub.unsubscribe();
  }

  abrirModal(compra: Compra) {
    this.selectedCompra = compra;
    this.modal.present();
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  getTimeline(compra: Compra) {
    const timeline = [];
    if (compra.estado === 'carrito' || compra.estado === 'pendiente') {
      timeline.push({ label: 'Falta pagar', done: false });
    } else {
      timeline.push({ label: 'Pago recibido', done: true });
    }

    if (compra.estado === 'enviado' || compra.estado === 'recibido') {
      timeline.push({ label: 'Empaquetado', done: true });
    } else {
      timeline.push({ label: 'Empaquetado', done: false });
    }

    if (compra.estado === 'enviado' || compra.estado === 'recibido') {
      timeline.push({ label: 'Enviado', done: true });
    } else {
      timeline.push({ label: 'Enviado', done: false });
    }

    if (compra.estado === 'recibido') {
      timeline.push({ label: 'Recibido', done: true });
    } else {
      timeline.push({ label: 'Recibido', done: false });
    }

    return timeline;
  }

  // Notificaciones filtradas por producto
  get notificacionesFiltradas(): Notificacion[] {
    if (!this.selectedCompra) return [];
    return this.notificaciones.filter(n => n.mensaje.includes(this.selectedCompra!.producto));
  }

  pagar(compra: Compra) {
    // Actualizamos estado
    this.historialService.actualizarEstado(compra.producto, 'pendiente');

    // Creamos notificación
    this.notiService.agregar(`Pago realizado para ${compra.producto}`, 'pagado');

    // Actualizamos inline modal si está abierto
    if (this.selectedCompra?.producto === compra.producto) {
      this.selectedCompra.estado = 'pendiente';
    }
  }
}
