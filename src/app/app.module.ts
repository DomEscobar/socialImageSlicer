import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EditorComponent } from './containers/editor/editor.component';
import { FormatsMenuComponent } from './containers/formats-menu/formats-menu.component';
import { HeaderComponent } from './containers/header/header.component';
import { PreviewComponent } from './containers/preview/preview.component';
import { Popup } from '@core';
import { ImgUploadComponent } from './@core/components/img-upload/img-upload.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ImageCropperModule } from '@cropper';
import { StartComponent } from './containers/start/start.component';
import { SelectionComponent } from './containers/header/selection/selection.component';
import { DraggableDirective } from './containers/editor/draggable.directive';
import { TruncatePipe } from './containers/header/selection/truncate.pipe';
import { GeneralComponent } from './containers/general/general.component';
import { EditorSettingsComponent } from './containers/editor/editor-settings/editor-settings.component';
import { FormsModule } from '@angular/forms';

export function createTranslateLoader(http: HttpClient)
{
  return new TranslateHttpLoader(http, 'assets/translation/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    FormatsMenuComponent,
    HeaderComponent,
    PreviewComponent,
    Popup,
    ImgUploadComponent,
    StartComponent,
    SelectionComponent,
    DraggableDirective,
    GeneralComponent,
    TruncatePipe,
    EditorSettingsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
