import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsCarouselComponent } from './tips-carousel.component';

describe('TipsCarouselComponent', () => {
  let component: TipsCarouselComponent;
  let fixture: ComponentFixture<TipsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
