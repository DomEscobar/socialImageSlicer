import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { EditorStoreService } from 'stores';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class EditorComponent
{
  public image$ =  this.editorStoreService.image$
  public format$ =  this.editorStoreService.format$

  constructor(private editorStoreService: EditorStoreService)
  {
  }
}
