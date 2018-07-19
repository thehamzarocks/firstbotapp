import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Dialog } from './Dialog';
import { AngularFirestore } from 'angularfire2/firestore';
import { DialogAdder } from './dialog-adder';

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

  constructor(private fb: FormBuilder, private db:AngularFirestore, private da:DialogAdder) { }

  // addObject() {
  //   var dialog = {
  //     id: 9,
  //     dsname: 'entry',
  //     response: 'hello!',
  //     selectors: [
  //       {
  //         statename: '',
  //         statevalue: '',
  //         intent: 'yes',
  //         mappedid: 1
  //       },
  //       {
  //         statename: '',
  //         statevalue: '',
  //         intent: 'no',
  //         mappedid: 2
  //       }
  //     ],
  //     autofetch: false,
  //   }

  //   this.db.collection('dialogsequences').add(dialog);      

  // }

  addDialogSelector(dialogindex: number): void {
    // console.log(dialogindex.toString());
    // console.log(this.regularDialogs.get('0.selectors').value);
    // this.regularDialogs.get(dialogindex.toString() + '.selectors').value.push(this.buildSelectors());

    const control = (<FormArray>this.dialogForm.controls['dialogs']).at(dialogindex).get('selectors') as FormArray;
    control.push(this.buildSelectors());
  }

  buildSelectors(): FormGroup {
    return this.fb.group({
      statename: '',
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
      nextds: '',
      selectors: this.fb.array([this.buildSelectors()]),      
    });
  }


  save() {
    this.da.AddDialogs(this.dialogForm.value);
  }

  ngOnInit() {    
    this.dialogForm = this.fb.group({
      dsname: '',
      dialogs: this.fb.array([]),      
    });
  }
}
