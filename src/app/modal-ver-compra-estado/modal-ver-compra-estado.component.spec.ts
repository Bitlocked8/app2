import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalVerCompraEstadoComponent } from './modal-ver-compra-estado.component';

describe('ModalVerCompraEstadoComponent', () => {
  let component: ModalVerCompraEstadoComponent;
  let fixture: ComponentFixture<ModalVerCompraEstadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVerCompraEstadoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVerCompraEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
