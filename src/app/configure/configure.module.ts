import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurePageRoutingModule } from './configure-routing.module';

import { ConfigurePage } from './configure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurePageRoutingModule
  ],
  declarations: [ConfigurePage]
})
export class ConfigurePageModule {}
