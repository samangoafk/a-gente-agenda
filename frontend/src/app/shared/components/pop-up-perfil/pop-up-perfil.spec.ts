import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpPerfil } from './pop-up-perfil';

describe('PopUpPerfil', () => {
  let component: PopUpPerfil;
  let fixture: ComponentFixture<PopUpPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpPerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(PopUpPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
