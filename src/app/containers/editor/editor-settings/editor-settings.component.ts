import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EditorFacade } from 'facades';
import { EditorStoreService } from 'stores';
import { Popup } from '@core';

@Component({
  selector: 'app-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class EditorSettingsComponent
{
  public scaleFactor = this.editorStoreService.transform.scale;

  constructor(
    private editorStoreService: EditorStoreService,
    private editorFacade: EditorFacade) { }
    
  public reset(): void
  {
    this.editorFacade.reset();
  }

  public toggleAspectRatio(): void
  {
    this.editorStoreService.aspetRatio = !this.editorStoreService.aspetRatio;

    Popup.info(`Aspect ratio is ${this.editorStoreService.aspetRatio ?  'activated' : 'deactivated'}`)
  }

  public zoom(factor: number): void
  {
    this.editorStoreService.transform = {
      ...this.editorStoreService.transform,
      scale: factor
    };
  }}
