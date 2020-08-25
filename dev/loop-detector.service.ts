import { Injectable } from '@angular/core';
import { environment } from '../src/environments/environment.prod';
import { EditorStoreService } from '../src/app/stores/editor.store.service';

/**
 * Class should detect subscription loops
 *
 * @export
 * @class LoopDetectorService
 */
@Injectable()
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
      console.log('Image changed');
    })

    this.editorStoreService.format$.subscribe(da =>
    {
      this.counter[2]++;
      console.log('Format changed');
    })
  }
}
