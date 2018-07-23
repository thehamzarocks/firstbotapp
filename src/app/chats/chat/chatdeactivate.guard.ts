import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatComponent } from './chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatdeactivateGuard implements CanDeactivate<ChatComponent> {
  canDeactivate(target: ChatComponent) { 
  
    if(target.isCompleted == false) {
      return window.confirm('If you leave this page, you\'ll have to start over.');   
    }
    return true;
    
  }
}
