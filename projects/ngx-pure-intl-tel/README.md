### Install This Library

`$ npm install ngx-pure-intl-tel --save`


### Usage

```
<form #f="ngForm"
        [formGroup]="phoneForm">
      <ngx-pure-intl-tel
        [preferredCountries]="preferredCountries"
        [enableAutoCountrySelect]="true"
        [enablePlaceholder]="true"
        [placeholder]="''"
        [searchCountryFlag]="true"
        [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
        [selectFirstCountry]="false"
        [selectedCountryISO]="CountryISO.Iran"
        [maxLength]="15"
        [phoneValidation]="true"
        [separateDialCode]="true"
        name="phone"
        formControlName="phone">
      </ngx-pure-intl-tel>
  </form>
```


More usages please go to [ngx-intl-tel-input](https://github.com/webcat12345/ngx-intl-tel-input).
