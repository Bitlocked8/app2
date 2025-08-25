import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { Subscription } from 'rxjs';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-ver-notificaciones',
  templateUrl: './modal-ver-notificaciones.component.html',
  styleUrls: ['./modal-ver-notificaciones.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
  ]
})
export class ModalVerNotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  sub!: Subscription;
  trashOutline = trashOutline;

  constructor(private notiService: NotificacionesService) { }

  ngOnInit() {
    this.sub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti.filter(n => n.tipo === 'carrito');
    });
  }

  limpiarNotificaciones() {
    this.notiService.limpiar();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getTextoBadge(noti: Notificacion): string {
    return noti.cantidad ? `${noti.cantidad} unidades añadidas al carrito` : 'Añadido al carrito';
  }




  getColorBadge(noti: Notificacion): string {
    return 'warning'; // o usa 'cyan' si quieres
  }
}
