import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Heade } from './heade';

describe('Heade', () => {
  let component: Heade;
  let fixture: ComponentFixture<Heade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heade],
    }).compileComponents();

    fixture = TestBed.createComponent(Heade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
