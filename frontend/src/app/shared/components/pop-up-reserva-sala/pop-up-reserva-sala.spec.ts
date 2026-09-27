import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpReservaSala } from './pop-up-reserva-sala';

describe('PopUpReservaSala', () => {
  let component: PopUpReservaSala;
  let fixture: ComponentFixture<PopUpReservaSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpReservaSala],
    }).compileComponents();

    fixture = TestBed.createComponent(PopUpReservaSala);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
