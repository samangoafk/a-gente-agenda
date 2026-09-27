import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardStatusSala } from './card-status-sala';

describe('CardStatusSala', () => {
  let component: CardStatusSala;
  let fixture: ComponentFixture<CardStatusSala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStatusSala],
    }).compileComponents();

    fixture = TestBed.createComponent(CardStatusSala);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
