import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbuilderComponent } from './chatbuilder.component';

describe('ChatbuilderComponent', () => {
  let component: ChatbuilderComponent;
  let fixture: ComponentFixture<ChatbuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
