import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { IUploadedFile } from '@core';
import { EditorFacadeService } from 'facades';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent
{
  constructor(
    private editorFacadeService: EditorFacadeService,
    private translate: TranslateService,
    private http: HttpClient)
  {
    
  }

  public initEditor(uploadedImages: IUploadedFile[]): void
  {
    this.editorFacadeService.initEditor(uploadedImages);
  }
}
