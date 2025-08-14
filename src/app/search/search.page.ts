import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonAvatar, 
  IonModal, IonButton, IonButtons, IonSegment, IonSegmentButton, IonList, IonText, IonInput 
} from '@ionic/angular/standalone';
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
    IonSegment,
    IonSegmentButton,
    IonList,
    IonText,
    IonInput,
    DatePipe
  ]
})
export class SearchPage implements OnDestroy {
  compras: Compra[] = [];
  selectedCompra?: Compra;
  notificaciones: Notificacion[] = [];
  notiSub!: Subscription;
  metodoPago = 'contado';
  metodoPagoAhora = 'qr';
  comprobanteSubido = false;

  @ViewChild('modal') modal!: IonModal;

  constructor(
    private historialService: HistorialService,
    private notiService: NotificacionesService
  ) {
    this.historialService.compras$.subscribe(c => this.compras = c);
    this.notiSub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti;
    });
  }

  ngOnDestroy() {
    this.notiSub.unsubscribe();
  }

  abrirModal(compra: Compra) {
    this.selectedCompra = compra;
    this.comprobanteSubido = false;
    this.modal.present();
  }

  cerrarModal() {
    this.modal.dismiss();
  }

  getTimeline(compra: Compra) {
    const timeline = [];
    if (compra.estado === 'carrito' || compra.estado === 'pendiente') {
      timeline.push({ label: 'Falta pagar', done: false });
    } else if (compra.estado === 'pagado' || compra.estado === 'enviado' || compra.estado === 'recibido') {
      timeline.push({ label: 'Pago realizado', done: true });
    }

    if (compra.estado === 'pagado' || compra.estado === 'enviado' || compra.estado === 'recibido') {
      timeline.push({ label: 'Empaquetado', done: compra.estado !== 'pagado' });
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

  get notificacionesFiltradas(): Notificacion[] {
    return this.notificaciones.filter(n => n.mensaje.includes(this.selectedCompra?.producto ?? ''));
  }

  pagar(compra: Compra) {
    if (!this.comprobanteSubido) return;
    this.historialService.actualizarEstado(compra.producto, 'pagado');
    this.notiService.agregar(`Pago realizado para ${compra.producto}`, 'pagado');
    if (this.selectedCompra?.producto === compra.producto) {
      this.selectedCompra.estado = 'pagado';
    }
  }

  onComprobanteSubido(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.comprobanteSubido = true;
      console.log('Comprobante subido:', file.name);
    }
  }
}
