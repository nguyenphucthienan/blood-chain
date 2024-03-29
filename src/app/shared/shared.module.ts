import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { QRCodeModule } from 'angularx-qrcode';
import { CountUpModule } from 'countup.js-angular2';
import { SidebarModule } from 'ng-sidebar';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

import {
  BloodPackTransferHistoriesComponent,
} from './components/blood-pack-transfer-histories/blood-pack-transfer-histories.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './components/header/header.component';
import { MapInputComponent } from './components/map-input/map-input.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PhotoUploaderComponent } from './components/photo-uploader/photo-uploader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ScanQrcodeModalComponent } from './modals/scan-qrcode-modal/scan-qrcode-modal.component';
import { BooleanYesNoPipe } from './pipes/boolean-yes-no.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    PaginationComponent,
    MapInputComponent,
    PhotoUploaderComponent,
    BreadcrumbComponent,
    ScanQrcodeModalComponent,
    BooleanYesNoPipe,
    BloodPackTransferHistoriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MDBBootstrapModule.forRoot(),
    SidebarModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey,
      libraries: ['places']
    }),
    FileUploadModule,
    NgxSpinnerModule,
    NgSelectModule,
    QRCodeModule,
    ZXingScannerModule,
    NgxPrintModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule.forRoot(),
    MglTimelineModule,
    CountUpModule,
    NgxGalleryModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot().ngModule,
    SidebarModule.forRoot().ngModule,
    TranslateModule.forRoot().ngModule,
    AgmCoreModule.forRoot().ngModule,
    NgxSpinnerModule,
    NgSelectModule,
    QRCodeModule,
    NgxPrintModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule.forRoot().ngModule,
    MglTimelineModule,
    CountUpModule,
    NgxGalleryModule,
    HeaderComponent,
    SidebarComponent,
    PaginationComponent,
    MapInputComponent,
    PhotoUploaderComponent,
    BreadcrumbComponent,
    ScanQrcodeModalComponent,
    BloodPackTransferHistoriesComponent,
    BooleanYesNoPipe
  ],
  entryComponents: [
    ScanQrcodeModalComponent
  ]
})
export class SharedModule { }
