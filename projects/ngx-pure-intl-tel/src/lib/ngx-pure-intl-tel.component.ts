import * as lpn from 'google-libphonenumber';

import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CountryCode } from './data/country-code';
import { CountryISO } from './enums/country-iso.enum';
import { SearchCountryField } from './enums/search-country-field.enum';
import { phoneNumberValidator } from './ngx-pure-intl-tel.validator';
import { DropdownComponent } from './components/dropdown/dropdown.component';

export interface ChangeData {
  number?: string;
  internationalNumber?: string;
  nationalNumber?: string;
  e164Number?: string;
  countryCode?: string;
  dialCode?: string;
}

export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes?: string[];
  htmlId: string;
  flagClass: string;
  placeHolder: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-pure-intl-tel',
  templateUrl: './ngx-pure-intl-tel.component.html',
  styleUrls: ['./assets/css/intlTelInput.scss', './ngx-pure-intl-tel.component.scss'],
  providers: [
    CountryCode,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxPureIntlTelComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: phoneNumberValidator,
      multi: true,
    },
  ],
})
export class NgxPureIntlTelComponent implements OnInit, OnChanges {
  @Input() value = '';
  @Input() preferredCountries: Array<string> = [];
  @Input() enablePlaceholder = true;
  @Input() placeholder = '';
  @Input() cssClass = '';
  @Input() onlyCountries: Array<string> = [];
  @Input() enableAutoCountrySelect = true;
  @Input() searchCountryFlag = false;
  @Input() searchCountryField: SearchCountryField[] = [SearchCountryField.All];
  @Input() searchCountryPlaceholder = 'search countries';
  @Input() maxLength = '';
  @Input() selectFirstCountry = true;
  @Input() selectedCountryISO: CountryISO;
  @Input() phoneValidation = true;
  @Input() inputId = 'phone';
  @Input() separateDialCode = false;
  separateDialCodeClass: string;

  dropdownVisible = false;

  @Output() readonly countryChange = new EventEmitter<Country>();


  @Input() phoneNumber = '';
  @Output() phoneNumberChange: EventEmitter<{ dialCode, phoneNumber }> = new EventEmitter<{ dialCode, phoneNumber }>();

  selectedCountry: Country = {
    areaCodes: undefined,
    dialCode: '',
    htmlId: '',
    flagClass: '',
    iso2: '',
    name: '',
    placeHolder: '',
    priority: 0,
  };

  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  // Has to be 'any' to prevent a need to install @types/google-libphonenumber by the package user...
  phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  disabled = false;
  errors: Array<any> = ['Phone number is required.'];
  countrySearchText = '';

  @ViewChild('countryList') countryList: ElementRef;
  @ViewChild(DropdownComponent) public dropdown: DropdownComponent;

  onTouched = () => {
  }
  propagateChange = (_: ChangeData) => {
  }

  constructor(private countryCodeData: CountryCode) {
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: any): void {
    const selectedISO = changes.selectedCountryISO;
    if (
      this.allCountries &&
      selectedISO &&
      selectedISO.currentValue !== selectedISO.previousValue
    ) {
      this.getSelectedCountry();
    }
    if (changes.preferredCountries) {
      this.getPreferredCountries();
    }
    this.checkSeparateDialCodeStyle();
  }

  /*
      This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
      Ref: http://codelyzer.com/rules/no-life-cycle-call/
  */
  init(): void {
    this.fetchCountryData();
    if (this.preferredCountries.length) {
      this.getPreferredCountries();
    }
    if (this.onlyCountries.length) {
      this.allCountries = this.allCountries.filter((c) =>
        this.onlyCountries.includes(c.iso2)
      );
    }
    if (this.selectFirstCountry) {
      if (this.preferredCountriesInDropDown.length) {
        this.setSelectedCountry(this.preferredCountriesInDropDown[0]);
      } else {
        this.setSelectedCountry(this.allCountries[0]);
      }
    }
    this.getSelectedCountry();
    this.checkSeparateDialCodeStyle();
  }

  getPreferredCountries(): void {
    if (this.preferredCountries.length) {
      this.preferredCountriesInDropDown = [];
      this.preferredCountries.forEach((iso2) => {
        const preferredCountry = this.allCountries.filter((c) => {
          return c.iso2 === iso2;
        });

        this.preferredCountriesInDropDown.push(preferredCountry[0]);
      });
    }
  }

  getSelectedCountry(): void {
    if (this.selectedCountryISO) {
      this.selectedCountry = this.allCountries.find((c) => {
        return c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase();
      });
      if (this.selectedCountry) {
        if (this.phoneNumber) {
          this.onPhoneNumberChange();
        } else {
          // Reason: avoid https://stackoverflow.com/a/54358133/1617590
          // tslint:disable-next-line: no-null-keyword
          this.propagateChange(null);
        }
      }
    }
  }

  setSelectedCountry(country: Country): void {
    this.selectedCountry = country;
    this.countryChange.emit(country);
  }

  /**
   * Search country based on country name, iso2, dialCode or all of them.
   */
  searchCountry(): void {
    if (!this.countrySearchText) {
      this.countryList.nativeElement
        .querySelector('.iti__country-list li')
        .scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      return;
    }
    const countrySearchTextLower = this.countrySearchText.toLowerCase();
    const country = this.allCountries.filter((c: any) => {
      if (this.searchCountryField.indexOf(SearchCountryField.All) > -1) {
        // Search in all fields
        if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
          return c;
        }
        if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
          return c;
        }
        if (c.dialCode.startsWith(this.countrySearchText)) {
          return c;
        }
      } else {
        // Or search by specific SearchCountryField(s)
        if (this.searchCountryField.indexOf(SearchCountryField.Iso2) > -1) {
          if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
            return c;
          }
        }
        if (this.searchCountryField.indexOf(SearchCountryField.Name) > -1) {
          if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
            return c;
          }
        }
        if (this.searchCountryField.indexOf(SearchCountryField.DialCode) > -1) {
          if (c.dialCode.startsWith(this.countrySearchText)) {
            return c;
          }
        }
      }
    });

    if (country.length > 0) {
      const el = this.countryList.nativeElement.querySelector(
        '#' + country[0].htmlId
      );
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }

    this.checkSeparateDialCodeStyle();
  }

  public onPhoneNumberChange(): void {
    let countryCode: string | undefined;
    // Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
    if (this.phoneNumber && typeof this.phoneNumber === 'object') {
      const numberObj: ChangeData = this.phoneNumber;
      this.phoneNumber = numberObj.number;
      countryCode = numberObj.countryCode;
    }

    this.value = this.phoneNumber;
    countryCode = countryCode || this.selectedCountry.iso2.toUpperCase();
    // tslint:disable-next-line:variable-name
    let number: lpn.PhoneNumber;
    try {
      number = this.phoneUtil.parse(this.phoneNumber, countryCode);
    } catch (e) {
    }

    // auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
    if (this.enableAutoCountrySelect) {
      countryCode =
        number && number.getCountryCode()
          ? this.getCountryIsoCode(number.getCountryCode(), number)
          : this.selectedCountry.iso2;
      if (countryCode && countryCode !== this.selectedCountry.iso2) {
        const newCountry = this.allCountries.sort((a, b) => {
          return a.priority - b.priority;
        }).find(
          (c) => c.iso2 === countryCode
        );
        if (newCountry) {
          this.selectedCountry = newCountry;
        }
      }
    }
    countryCode = countryCode ? countryCode : this.selectedCountry.iso2;

    this.checkSeparateDialCodeStyle();

    if (!this.value) {
      // Reason: avoid https://stackoverflow.com/a/54358133/1617590
      // tslint:disable-next-line: no-null-keyword
      this.propagateChange(null);
    } else {
      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';

      // parse phoneNumber if separate dial code is needed
      if (this.separateDialCode && intlNo) {
        this.value = this.removeDialCode(intlNo);
      }

      this.propagateChange({
        number: this.value,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: countryCode.toUpperCase(),
        dialCode: '+' + this.selectedCountry.dialCode,
      });
    }
    this.phoneNumberChange.emit({ dialCode: this.selectedCountry.dialCode, phoneNumber: (this.phoneNumber || '') } );
  }

  public onCountrySelect(country: Country, el): void {
    this.setSelectedCountry(country);

    this.checkSeparateDialCodeStyle();

    if (this.phoneNumber && this.phoneNumber.length > 0) {
      this.value = this.phoneNumber;

      // tslint:disable-next-line:variable-name
      let number: lpn.PhoneNumber;
      try {
        number = this.phoneUtil.parse(
          this.phoneNumber,
          this.selectedCountry.iso2.toUpperCase()
        );
      } catch (e) {
      }

      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';

      // parse phoneNumber if separate dial code is needed
      if (this.separateDialCode && intlNo) {
        this.value = this.removeDialCode(intlNo);
      }

      this.propagateChange({
        number: this.value,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: this.selectedCountry.iso2.toUpperCase(),
        dialCode: '+' + this.selectedCountry.dialCode,
      });
    } else {
      // Reason: avoid https://stackoverflow.com/a/54358133/1617590
      // tslint:disable-next-line: no-null-keyword
      this.propagateChange(null);
    }

    el.focus();
    this.hideDropdown();
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  public showDropdown(): void {
    this.dropdownVisible = true;
    this.dropdown.show();
  }

  public hideDropdown(): void {
    this.dropdownVisible = false;
    this.dropdown.hide();
  }

  protected fetchCountryData(): void {
    /* Clearing the list to avoid duplicates (https://github.com/webcat12345/ngx-intl-tel-input/issues/248) */
    this.allCountries = [];

    this.countryCodeData.allCountries.forEach((c) => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: (c[4] as string[]) || undefined,
        htmlId: `iti-0__item-${c[1].toString()}`,
        flagClass: `iti__${c[1].toString().toLocaleLowerCase()}`,
        placeHolder: '',
      };
      if(c[5] && c[5].toString() && this.enablePlaceholder){
        country.placeHolder = c[5].toString();
      } else if (this.enablePlaceholder && !c[5]) {
        country.placeHolder = this.getPhoneNumberPlaceHolder(
          country.iso2.toUpperCase()
        );
      } else if(this.placeholder){
        country.placeHolder = this.placeholder;
      }

      this.allCountries.push(country);
    });
  }


  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(
        this.phoneUtil.getExampleNumber(countryCode),
        lpn.PhoneNumberFormat.INTERNATIONAL
      );
    } catch (e) {
      return e;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj === undefined) {
      this.init();
    }
    //this.phoneNumber = obj;
    setTimeout(() => {
      this.onPhoneNumberChange();
    }, 1);
  }

  private getCountryIsoCode(
    countryCode: number,
    // tslint:disable-next-line:variable-name
    number: lpn.PhoneNumber
  ): string | undefined {
    // Will use this to match area code from the first numbers
    // tslint:disable-next-line:no-string-literal
    const rawNumber = number['values_']['2'].toString();
    // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
    const countries = this.allCountries.filter(
      (c) => c.dialCode === countryCode.toString()
    );
    // Main country is the country, which has no areaCodes specified in country-code.ts file.
    const mainCountry = countries.find((c) => c.areaCodes === undefined);
    // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
    const secondaryCountries = countries.filter(
      (c) => c.areaCodes !== undefined
    );
    let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

    /*
        Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
        If no matches found, fallback to the main country.
    */
    secondaryCountries.forEach((country) => {
      country.areaCodes.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.iso2;
        }
      });
    });

    return matchedCountry;
  }

  separateDialCodePlaceHolder(placeholder: string): string {
    return this.removeDialCode(placeholder);
  }

  private removeDialCode(phoneNumber: string): string {
    if (this.separateDialCode && phoneNumber && !this.placeholder) {
      phoneNumber = phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
    }
    return phoneNumber;
  }

  // adjust input alignment
  private checkSeparateDialCodeStyle(): void {
    if (this.separateDialCode && this.selectedCountry) {
      const cntryCd = this.selectedCountry.dialCode;
      this.separateDialCodeClass =
        'separate-dial-code iti-sdc-' + (cntryCd.length + 1);
    } else {
      this.separateDialCodeClass = '';
    }
  }

}
