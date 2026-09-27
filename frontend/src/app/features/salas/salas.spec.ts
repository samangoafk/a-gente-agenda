import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Salas } from './salas';

describe('Salas', () => {
  let component: Salas;
  let fixture: ComponentFixture<Salas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salas],
    }).compileComponents();

    fixture = TestBed.createComponent(Salas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
