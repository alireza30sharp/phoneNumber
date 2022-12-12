import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UtilitiesService } from 'src/app/service/utilities.service';

@Component({
  selector: 'app-sms-code',
  templateUrl: './sms-code.component.html',
  styleUrls: ['./sms-code.component.scss']
})
export class SmsCodeComponent implements OnInit {
  @Input() digitCount: number;
  @Input() isEditNumber: boolean = true;
  @Output() onComplete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter();
  @Output() onExpire = new EventEmitter();

  public _codes: number[] = [];
  public _codesArray: number[] = [1,2,3,4];
  public readonly _inputName = 'exirTextCode';  


  constructor(private utilitiesSvc: UtilitiesService) { }

  ngOnInit(): void {
    this.initComponent();
  }

  private initComponent(): void {
    if (!!this.digitCount) {
      this._codes = new Array<number>(this.digitCount).fill(null);
      this._codesArray = new Array<number>(this.digitCount).fill(null);
    }
  }

  private emit(): void {
    if (this._codes.join('').length === this.digitCount) {
      this.onComplete.emit(this._codes.join(''));
    }
  }

  public onInput(event, elementId: number): void {
    var currentElement = document.getElementById(this._inputName + elementId);
    var nextElement = document.getElementById(this._inputName + (elementId + 1));

    if ((currentElement as HTMLInputElement)['value'].toString().length === 1) {
      if (!!nextElement)
        this.utilitiesSvc.onFocusElement(nextElement);
      else
        this.emit();
    }
    else if ((currentElement as HTMLInputElement)['value'].toString().length > 1) {
      var content = (currentElement as HTMLInputElement)['value'];
      (currentElement as HTMLInputElement)['value'] = content.slice(content.length - 1, 2);
      this._codes[elementId] = +(currentElement as HTMLInputElement)['value'];


      if (!!nextElement)
        this.utilitiesSvc.onFocusElement(nextElement);
      else
        this.emit();
    }
  }

  public onFocus(event) {
    event.target.textContent = '';
  }

  public onBackspaceKey(event, elementId: number): void {
    if (elementId > 0) {
      var prevElement = document.getElementById(this._inputName + (elementId - 1));
      prevElement.textContent = '';
      this.utilitiesSvc.onFocusElement(prevElement);
    }
    else {
      var currentElement = document.getElementById(this._inputName + elementId);
      currentElement.textContent = '';
    }
  }

  public editNumber(): void {
    this.onEdit.emit();
  }

  public onExpireTimer() {
    this.onExpire.emit();
  }
}
