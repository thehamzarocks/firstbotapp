import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class DialogAdder {

    dsname: String;

    constructor(private db:AngularFirestore) {}

    CheckIfAutoFetch(dialog): boolean {
        var selectors = dialog.selectors;
        return (selectors[0].intent=='');
    }

    AddDialogs(formObject) {
        var index = 0;
        var numDialogs = formObject.dialogs.length;
        this.dsname = formObject.dsname;

        for(index=0;index<numDialogs;index++) {
            this.AddDialog(formObject, index);
        }
        
    }

    private AddDialog(formObject: any, index: number) {
        var dialog = formObject.dialogs[index];
        var dialogObject;
        if (dialog.type == 'rr') {
            dialogObject = {
                type: 'rr',
                dsname: this.dsname,
                id: index,
                being: dialog.being,
                response: dialog.response,
                fallback: dialog.fallback,
                autofetch: this.CheckIfAutoFetch(dialog),
                nextds: this.dsname,
                selectors: dialog.selectors,
            };
        }
        else if (dialog.type == 'cn') {
            dialogObject = {
                type: 'cn',
                dsname: this.dsname,
                id: index,
                operation: dialog.operation,
                op1: dialog.op1,
                op2: dialog.op2,
                autofetch: this.CheckIfAutoFetch(dialog),
                nextds: this.dsname,
                selectors: dialog.selectors,
            };
        }
        else if (dialog.type == 'en') {
            dialogObject = {
                type: 'en',
                dsname: this.dsname,
                id: index,                
                autofetch: true,
                nextds: dialog.nextds,                
            };
        }

        this.CallFireStore(dialogObject);
    }

    CallFireStore(dialogObject) {
        this.db.collection('dialogsequences').add(dialogObject);

    }
}