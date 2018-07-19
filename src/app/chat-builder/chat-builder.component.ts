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

  get selectors(): FormArray{
    return <FormArray>this.dialogForm.get('selectors');
  }

  constructor(private fb: FormBuilder) { }

  addDialogSelector(dialogindex: number): void {
    // console.log(dialogindex.toString());
    // console.log(this.regularDialogs.get('0.selectors').value);
    // this.regularDialogs.get(dialogindex.toString() + '.selectors').value.push(this.buildSelectors());

    const control = (<FormArray>this.dialogForm.controls['dialogs']).at(dialogindex).get('selectors') as FormArray;
    control.push(this.buildSelectors());
  }

  buildSelectors(): FormGroup {
    return this.fb.group({
      statevalue: '',
      intent: '',
      nextid: 0
    });
  }
  

  addDialog(dialogType:string): void {
    this.dialogs.push(this.buildDialogs(dialogType));
  }

  buildDialogs(dialogType: string): FormGroup {
    return this.fb.group({
      type: dialogType,
      being: '',
      response: '',
      fallback: '',
      operation: '',
      op1: '',
      op2: '',
      selectors: this.fb.array([this.buildSelectors()]),      
    });
  }


  save() {
    console.log(this.dialogForm.value);
  }

  ngOnInit() {
    this.dialogForm = this.fb.group({
      dsname: '',
      dialogs: this.fb.array([]),      
    });
  }
}
