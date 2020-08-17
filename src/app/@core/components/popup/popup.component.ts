import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PopupData } from './models/popupData.model';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Popuptype } from './models/popuptype.enum';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Popup
{
  private static popupDataSub = new BehaviorSubject<PopupData>(null);
  static popupData$: Observable<PopupData> = Popup.popupDataSub.asObservable();

  constructor()
  {
    Popup.popupData$.pipe(
      switchMap((popData) =>
      {
        if (!popData)
        {
          return of();
        }

        return interval(popData.seconds);
      })
    )
      .subscribe(() => this.hide());
  }

  static success(success = 'success', seconds = 3000)
  {
    this.popupDataSub.next(new PopupData(Popuptype.SUCCESS, success, seconds));
  }

  static info(info = 'info', seconds = 3000)
  {
    this.popupDataSub.next(new PopupData(Popuptype.INFO, info, seconds));
  }

  static error(error = 'error', seconds = 3000)
  {
    this.popupDataSub.next(new PopupData(Popuptype.ERROR, error, seconds));
  }

  static hide()
  {
    this.popupDataSub.next(null);
  }

  public get popupData$(): Observable<PopupData>
  {
    return Popup.popupData$;
  }

  public hide()
  {
    Popup.popupDataSub.next(null);
  }
}
