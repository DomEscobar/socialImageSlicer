import { Component, OnInit } from '@angular/core';
import { IUploadedFile } from '@core';
import { EditorFacade } from 'facades';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit
{
  constructor(private editorFacade: EditorFacade) { }

  ngOnInit(): void
  {
  }

  public initEditor(uploadedImages: IUploadedFile[]): void
  {
    this.editorFacade.initEditor(uploadedImages);
  }
}
