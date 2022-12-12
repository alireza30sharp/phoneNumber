import { Component, OnInit, Output, Input, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { CountryISO, SearchCountryField } from '@projects/ngx-pure-intl-tel/src/public-api';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss']
})
export class PhoneNumberComponent  {

  @Output() onChange = new EventEmitter<{ status: boolean, phoneNumber: string }>();
  @Output() onEnter = new EventEmitter();

  @Input() phoneNumber: string;

  @ViewChild('phoneNumberForm') phoneNumberForm: NgForm;

  phoneNumberChange(value: { dialCode, phoneNumber }) {

    value.phoneNumber = value.phoneNumber.slice(value.phoneNumber.length - 10);

    if (this.phoneNumberForm && this.phoneNumberForm.valid) {
      this.onChange.emit({ status: true, phoneNumber: value.dialCode + value.phoneNumber });
    } else {
      this.onChange.emit({ status: false, phoneNumber: value.dialCode + value.phoneNumber });
    }
  }


  constructor() { }


  public onEnterkey(): void {
    this.onEnter.emit();
  }




  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  changePreferredCountries(): void {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }




}
