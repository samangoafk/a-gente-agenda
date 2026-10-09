import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Coordenador } from './coordenador';

describe('Coordenador', () => {
  let component: Coordenador;
  let fixture: ComponentFixture<Coordenador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordenador],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordenador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
