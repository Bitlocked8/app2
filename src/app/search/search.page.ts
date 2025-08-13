import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HistorialService, Compra } from '../services/historial.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonAvatar
} from '@ionic/angular/standalone';

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
    IonAvatar
  ]
})
export class SearchPage implements OnInit, OnDestroy {
  compras: Compra[] = [];
  private sub!: Subscription;

  constructor(private historialService: HistorialService) {}

  ngOnInit() {
    this.sub = this.historialService.compras$.subscribe(compras => {
      this.compras = compras;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
