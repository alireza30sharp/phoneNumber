import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgxPureIntlTelModule } from '@projects/ngx-pure-intl-tel/src/public-api';
import { PhoneNumberComponent } from './pages/phone-number/phone-number.component';
import { SmsCodeComponent } from './pages/sms-code/sms-code.component';
import { TimerComponent } from './pages/timer/timer.component';
import { SelectLocationMapBoxComponent } from './pages/select-location-map-box/select-location-map-box.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    PhoneNumberComponent,
    SmsCodeComponent,
    TimerComponent,
    SelectLocationMapBoxComponent
  ],
  imports: [
    BrowserModule,
    NgxPureIntlTelModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
