import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharRowComponent } from './char-row.component';

describe('CharRowComponent', () => {
  let component: CharRowComponent;
  let fixture: ComponentFixture<CharRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
