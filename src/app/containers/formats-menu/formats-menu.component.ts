import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormatData } from 'models';
import { Popup } from '@core';

@Component({
  selector: 'app-formats-menu',
  templateUrl: './formats-menu.component.html',
  styleUrls: ['./formats-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormatsMenuComponent implements OnInit
{
  public providers$: Observable<string[]>;
  public selectedProvider: string;
  public formats: FormatData[];

  constructor(private http: HttpClient, private changedetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void
  {
    this.providers$ = this.http.get<string[]>('./assets/providers/providers.json');
  }

  public async readFormatsAsync(providername: string): Promise<void>
  {
    await this.http.get<FormatData[]>(`./assets/providers/${ providername }/formats.json`).toPromise()
      .then(formats =>
      {
        this.selectedProvider = providername;
        this.formats = formats;
        this.changedetectionRef.markForCheck();
      })
      .catch(error =>
      {
        Popup.error('Provider doesnt exists');
      });
  }
}
