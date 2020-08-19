import { Component, OnInit } from '@angular/core';
import { ImageData } from 'models';
import { EditorFacade } from 'facades';
import { EditorStoreService, ImagesStoreService } from 'stores';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit
{
  public showOptions: boolean = false;
  public images$ = this.imagesStoreService.images$;
  public selected$ = this.editorStoreService.image$;

  constructor(
    private imagesStoreService: ImagesStoreService,
    private editorStoreService: EditorStoreService,
    private editorFacade: EditorFacade) { }

  ngOnInit() { }

  public select(img: ImageData): void
  {
    this.showOptions = false;
    this.editorFacade.selectImage(img);
  }
}
