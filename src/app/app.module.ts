import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';


import { ChatComponent } from './chats/chat/chat.component';
import { environment } from '../environments/environment';
import { ChatBuilderComponent } from './chat-builder/chat-builder.component';
import { DialogAdder } from './chat-builder/dialog-adder';



@NgModule({
  declarations: [    
    ChatComponent,
    ChatBuilderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AngularDraggableModule
    
  ],
  providers: [
    FormBuilder,
    DialogAdder
  ],
  bootstrap: [ChatBuilderComponent]
})
export class AppModule { }
