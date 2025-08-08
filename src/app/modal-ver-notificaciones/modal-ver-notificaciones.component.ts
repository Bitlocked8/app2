import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { Subscription } from 'rxjs';
import { trashOutline, checkmarkDoneOutline } from 'ionicons/icons';

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
export class ModalVerNotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  sub!: Subscription;

  constructor(private notiService: NotificacionesService) {}

  ngOnInit() {
    this.sub = this.notiService.getObservable().subscribe(noti => {
      this.notificaciones = noti;
    });
  }

  marcarLeida(id: number) {
    this.notiService.marcarComoLeida(id);
  }

  limpiarNotificaciones() {
    this.notiService.limpiar();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
