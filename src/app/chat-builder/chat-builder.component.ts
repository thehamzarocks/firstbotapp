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

  get regularDialogs(): FormArray{
    return <FormArray>this.dialogForm.get('regularDialogs');
  }

  get selectors(): FormArray{
    return <FormArray>this.dialogForm.get('selectors');
  }

  constructor(private fb: FormBuilder) { }

  addSelector(dialogindex: number): void {
    // console.log(dialogindex.toString());
    // console.log(this.regularDialogs.get('0.selectors').value);
    // this.regularDialogs.get(dialogindex.toString() + '.selectors').value.push(this.buildSelectors());

    const control = (<FormArray>this.dialogForm.controls['regularDialogs']).at(dialogindex).get('selectors') as FormArray;
    control.push(this.buildSelectors());
  }

  buildSelectors(): FormGroup {
    return this.fb.group({
      statevalue: '',
      intent: '',
      nextid: 0
    });
  }

  addRegularDialog(): void {
    this.regularDialogs.push(this.buildRegularDialogs());
  }

  buildRegularDialogs(): FormGroup {
    return this.fb.group({
      being: '',
      response: '',
      fallback: '',
      selectors: this.fb.array([this.buildSelectors()]),      
    });
  }



  ngOnInit() {
    this.dialogForm = this.fb.group({
      dsname: '',
      regularDialogs: this.fb.array([this.buildRegularDialogs()]),

    });
  }
}
