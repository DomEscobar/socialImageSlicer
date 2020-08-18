import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IUploadedFile } from '@core';
import { EditorStoreService } from 'stores';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent
{
  constructor(
    public editorStoreService: EditorStoreService)
  {
  }
  
  public addImages(uploadedImages: IUploadedFile[]): void
  {
  }
}
