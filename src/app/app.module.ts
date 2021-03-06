import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';

import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';


import { ChatComponent } from './chats/chat/chat.component';
import { environment } from '../environments/environment';
import { ChatBuilderComponent } from './chat-builder/chat-builder.component';
import { DialogAdder } from './chat-builder/dialog-adder';
import { AuthComponent } from './auth/auth.component';
import {RouterModule} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { HighscoreComponent } from './highscore/highscore.component';
import { ChatdeactivateGuard } from './chats/chat/chatdeactivate.guard';
import { NarrativesComponent } from './narratives/narratives.component';



@NgModule({
  declarations: [    
    ChatComponent,
    ChatBuilderComponent,
    AuthComponent,
    AppComponent,
    HighscoreComponent,
    NarrativesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AngularDraggableModule,
    RouterModule.forRoot([
      {path:'chat/:id', canDeactivate: [ChatdeactivateGuard], component:ChatComponent},
      {path:'highscore', component:HighscoreComponent},
      {path:'narratives', component:NarrativesComponent},
      {path:'', component:AuthComponent},
    ])
    
  ],
  providers: [
    FormBuilder,
    DialogAdder,
    AngularFireAuth,    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
