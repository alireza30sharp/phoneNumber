import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { NgxPureIntlTelComponent } from './ngx-pure-intl-tel.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    NgxPureIntlTelComponent,
    NativeElementInjectorDirective,
    DropdownComponent
  ],
  imports: [
    PortalModule,
    OverlayModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NgxPureIntlTelComponent, NativeElementInjectorDirective],
})
export class NgxPureIntlTelModule {

}
