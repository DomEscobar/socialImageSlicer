import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IUploadedFile } from '@core';
import { EditorStoreService } from 'stores';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent
{
  constructor(
    private translate: TranslateService,
    public editorStoreService: EditorStoreService)
  {
    this.translate.setDefaultLang('de');
    this.translate.use(this.translate.getBrowserLang());
  }

  public addImages(uploadedImages: IUploadedFile[]): void
  {
  }
}
