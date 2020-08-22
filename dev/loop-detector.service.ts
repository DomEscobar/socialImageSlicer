import { Injectable } from '@angular/core';
import { environment } from '../src/environments/environment.prod';
import { EditorStoreService } from '../src/app/stores/editor.store.service';

@Injectable({
  providedIn: 'root'
})
export class LoopDetectorService
{
  counter = [];

  constructor(private editorStoreService: EditorStoreService)
  {
    if (environment.production)
    {
      return;
    }

    this.editorStoreService.image$.subscribe(da =>
    {
      this.counter[1]++;
    })

    this.editorStoreService.format$.subscribe(da =>
    {
      this.counter[2]++;
    })
  }
}
