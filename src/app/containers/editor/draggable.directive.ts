import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective
{
  currentX;
  currentY;

  initialX;
  initialY;
  xOffset = 0;
  yOffset = 0;
  active;

  @Output()
  translate: EventEmitter<Translate> = new EventEmitter();

  _isCropping : boolean;

  @Output()
  set isCropping(isCropping : boolean)
  {
    if(isCropping)
    {
      this.active = false;
    }

    this._isCropping = isCropping;
  }

  get isCropping() : boolean
  {
    return this._isCropping
  }

  constructor(private elementRef: ElementRef)
  {
    const container = <HTMLElement>this.elementRef.nativeElement;

    container.addEventListener("touchstart", this.dragStart, false);
    container.addEventListener("touchend", this.dragEnd, false);
    container.addEventListener("touchmove", this.drag, false);

    container.addEventListener("mousedown", this.dragStart, false);
    container.addEventListener("mouseup", this.dragEnd, false);
    container.addEventListener("mousemove", this.drag, false);
  }

  dragStart = (e) =>
  {
    if(this.isCropping || this.active)
    {
      return;
    }

    if (e.type === "touchstart")
    {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else
    {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }

    this.active = true;
  }

  dragEnd = (e) =>
  {
    this.initialX = this.currentX;
    this.initialY = this.currentY;

    this.active = false;
  }

  drag = (e) =>
  {
    if (this.active)
    {
      e.preventDefault();

      if (e.type === "touchmove")
      {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else
      {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.translate.emit({ x: this.currentX, y: this.currentY });
    }
  }
}

export interface Translate
{
  x: number;
  y: number;
}