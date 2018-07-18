import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBuilderComponent } from './chat-builder.component';

describe('ChatBuilderComponent', () => {
  let component: ChatBuilderComponent;
  let fixture: ComponentFixture<ChatBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
