import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIntentObject } from '../../intentobject';


const startConversationHttpOptions = {
  headers: new HttpHeaders({    
    'Authorization': 'Bearer 6Pak39YWbB0.cwA.6kg.O283ck7ACtGMI-R-Gqs6tLQreF0_eeCY0YPaKybleak'
  })
};

const sendActivityHttpOptions = {
  headers: new HttpHeaders({    
    // 'Authorization': 'Bearer 6Pak39YWbB0.cwA.6kg.O283ck7ACtGMI-R-Gqs6tLQreF0_eeCY0YPaKybleak',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  ReceiveFromWit(input: string):Observable<any> {
    var url: string =  'https://api.wit.ai/message?v=20180624&q=' + input;


    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer M5HYQXSTM2EOPKAMSQ472TSMIDHGOWXQ');
      
    return this.http.get(url,{headers:headers});
  }
  
}
