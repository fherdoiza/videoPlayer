import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClipComponent } from './modal-clip.component';

describe('ModalClipComponent', () => {
  let component: ModalClipComponent;
  let fixture: ComponentFixture<ModalClipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalClipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
