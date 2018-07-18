import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Dialog } from './Dialog';

@Component({
  selector: 'app-chat-builder',
  templateUrl: './chat-builder.component.html',
  styleUrls: ['./chat-builder.component.css']
})
export class ChatBuilderComponent implements OnInit {

  dialogForm: FormGroup;
  dialog: Dialog = new Dialog();

  get dialogs(): FormArray{
    return <FormArray>this.dialogForm.get('dialogs');
  }

  constructor(private fb: FormBuilder) { }

  addDialog(): void {
    this.dialogs.push(this.buildDialogs());
  }

  buildDialogs(): FormGroup {
    return this.fb.group({
      response: '',
        intent: 0
    });
  }



  ngOnInit() {
    this.dialogForm = this.fb.group({
      dsname: '',
      dialogs: this.fb.array([this.buildDialogs()]),
    });
  }
}
