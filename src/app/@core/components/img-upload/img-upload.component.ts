import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, Observer, from, throwError, BehaviorSubject } from 'rxjs';
import { concatMap, catchError, tap, finalize, delay, take } from 'rxjs/operators';
import { IUploadedFile } from './models/Iupload-file.model';
import { UploadError } from './models/upload-error.enum';
import { UploadState } from './models/upload-state.enum';


@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgUploadComponent
{
  @Input() successBuffer = 2000;

  @Output() onUpdate: EventEmitter<IUploadedFile> = new EventEmitter();
  @Output() onFinish: EventEmitter<IUploadedFile[]> = new EventEmitter();
  @Output() onError: EventEmitter<UploadError> = new EventEmitter();

  private readonly uploadFiles = new BehaviorSubject<IUploadedFile[]>([]);
  public readonly uploadFiles$ = this.uploadFiles.asObservable();

  private readonly uploadState = new BehaviorSubject<UploadState>(UploadState.DEFAULT);
  public readonly uploadState$ = this.uploadState.asObservable();

  public uploadStates = UploadState;
  public uploadError: UploadError;

  constructor() { }

  public handleUpload(event): void
  {
    const files = event?.target?.files;
    this.clear();

    from(files)
      .pipe(
        tap(() => this.setState(UploadState.LOADING)),
        concatMap((file: File) =>
          this.handleFile(file).pipe(
            catchError((error: UploadError) => throwError(error)),
            delay(400)
          )
        ),
        take(files.length),
        finalize(() =>
        {
          if (this.uploadState.getValue() == UploadState.ERROR)
          {
            return;
          }

          this.displayFinish();
        })
      )
      .subscribe(
        (uploadFile: IUploadedFile) =>
        {
          this.uploadFiles.next([...this.uploadFiles.getValue(), uploadFile]);
          this.onUpdate.emit(uploadFile);
        },
        (error: UploadError) =>
        {
          this.setState(UploadState.ERROR)
          this.uploadError = error;
          this.onError.emit(error);
        }
      );
  }

  public setState(uploadState: UploadState): void
  {
    this.uploadState.next(uploadState);
  }

  private displayFinish()
  {
    this.setState(UploadState.FINISH);

    setTimeout(() =>
    {
      this.setState(UploadState.DEFAULT);
      this.onFinish.emit(this.uploadFiles.getValue());
    }, this.successBuffer);
  }

  private handleFile(file: File): Observable<IUploadedFile>
  {
    const fileReader = new FileReader();
    const { type, name } = file;
    return new Observable((observer: Observer<IUploadedFile>) =>
    {
      fileReader.readAsDataURL(file);
      fileReader.onload = event =>
      {
        if (!this.isImage(type))
        {
          observer.error(UploadError.NO_IMG);
        }

        this.loadImage({ name: name, base64: fileReader.result as string }, observer);
      };

      fileReader.onerror = () =>
      {
        observer.error(UploadError.FILE_FORMAT);
      };
    });
  }

  private loadImage(file: IUploadedFile, observer: Observer<IUploadedFile>): void
  {
    const image = new Image();
    image.onload = () =>
    {
      observer.next(file);
      observer.complete();
    };
    image.onerror = () =>
    {
      observer.error(UploadError.FILE_FORMAT);
    };
    image.src = file.base64;
  }

  private isImage(mimeType: string): boolean
  {
    return mimeType.match(/image\/*/) !== null;
  }

  private clear(): void
  {
    this.uploadFiles.next([]);
  }
}
