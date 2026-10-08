import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusAgendamentos } from './meus-agendamentos';

describe('MeusAgendamentos', () => {
  let component: MeusAgendamentos;
  let fixture: ComponentFixture<MeusAgendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusAgendamentos],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusAgendamentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
