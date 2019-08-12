import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BloodBankModule } from './blood-banks/blood-banks.module';
import { BloodCampsModule } from './blood-camps/blood-camps.module';
import { BloodSeparationCentersModule } from './blood-separation-centers/blood-separation-centers.module';
import { BloodTestCentersModule } from './blood-test-centers/blood-test-centers.module';
import { CampaignModule } from './campaign/campaign.module';
import { CoreModule } from './core/core.module';
import { DonationHistoryModule } from './donation-history/donation-history.module';
import { HospitalModule } from './hospital/hospital.module';
import { ManagerModule } from './manager/manager.module';
import { ProfileModule } from './profile/profile.module';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    PublicModule,
    AdminModule,
    ManagerModule,
    ProfileModule,
    DonationHistoryModule,
    BloodCampsModule,
    BloodTestCentersModule,
    BloodSeparationCentersModule,
    BloodBankModule,
    HospitalModule,
    CampaignModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
