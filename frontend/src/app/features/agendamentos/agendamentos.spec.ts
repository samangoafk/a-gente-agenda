import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agendamentos } from './agendamentos';

describe('Agendamentos', () => {
  let component: Agendamentos;
  let fixture: ComponentFixture<Agendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agendamentos],
    }).compileComponents();

    fixture = TestBed.createComponent(Agendamentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
