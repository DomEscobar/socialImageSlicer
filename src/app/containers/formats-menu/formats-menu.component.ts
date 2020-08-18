import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormatData } from 'models';
import { FormatsMenuFacade } from '../../facades/formats-menu.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-formats-menu',
  templateUrl: './formats-menu.component.html',
  styleUrls: ['./formats-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormatsMenuComponent implements OnInit
{
  public selectedProvider: string;

  constructor(private formatsMenuFacade: FormatsMenuFacade) { }

  ngOnInit(): void
  {
    this.formatsMenuFacade.initMenu();
  }

  public selectProvider(provider: string): void
  {
    if (provider === this.selectedProvider)
    {
      this.selectedProvider = null;
      return;
    }

    this.selectedProvider = provider;
  }

  public get providers$(): Observable<string[]>
  {
    return this.formatsMenuFacade.providers$
  }

  public getFormats(): FormatData[]
  {
    return this.formatsMenuFacade.providerMap.get(this.selectedProvider);
  }

  public selectFormat(format: FormatData): void
  {
    this.formatsMenuFacade.selectFormat(format);
  }
}