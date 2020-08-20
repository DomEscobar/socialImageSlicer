import { Component, OnInit } from '@angular/core';
import { EditorFacade } from 'facades';
import { IUploadedFile, ExportService } from '@core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  constructor(
    private exportService: ExportService,
    private editorFacade: EditorFacade) { }

  ngOnInit(): void
  {
  }

  public addUploadedImages(images: IUploadedFile[]): void
  {
    this.editorFacade.addUploadedImages(images);
  }

  public exportImages(): void
  {
    this.exportService.exportImages();
  }
}
