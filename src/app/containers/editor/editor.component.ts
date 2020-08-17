import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EditorStoreService } from 'stores';
import { ImageData } from 'models';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent
{
  constructor(private editorStoreService: EditorStoreService) { }

  get image$(): Observable<ImageData>
  {
    return this.editorStoreService.image$;
  }
}
