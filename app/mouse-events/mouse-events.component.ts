import { Component, OnInit, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';
@Component({
  selector: 'app-mouse-events',
  templateUrl: './mouse-events.component.html',
  styleUrls: ['./mouse-events.component.css']
})
export class MouseEventsComponent implements OnInit {
  mouseup$: any;
  mousedown$: any;
  mousemove$: any;
  mousehold$: any;
  x: number;
  y: number;
  _sub: any;
  constructor(private _el: ElementRef) { }

  ngOnInit() {
    this.mousedown$ = fromEvent(this._el.nativeElement, 'mousedown');
    this.mousedown$.subscribe((e) => {
      this.x = e.x;
      this.y = e.y;
    })
    this.mousemove$ = fromEvent(this._el.nativeElement, 'mousemove');
    this.mouseup$ = fromEvent(this._el.nativeElement, 'mouseup');

    this.mouseup$.subscribe(()=>{
      this.unsub();
      this.register();
    });

    // switchMap is extremely helpful
    // map source observable to inner observable. remember it as switch to new observable.
    this.mousehold$ = this.mousedown$.switchMap(()=> this.mousemove$).takeUntil(this.mouseup$);

    this._sub = this.mousehold$.subscribe((e) => {
      this.x = e.x;
      this.y = e.y;
    })
  }

  unsub() {
    if(this._sub) {
      this._sub.unsubscribe();
    }
  }

  register() {
    this.mousehold$ = this.mousedown$.switchMap(()=> this.mousemove$).takeUntil(this.mouseup$);

    this._sub = this.mousehold$.subscribe((e) => {
      this.x = e.x;
      this.y = e.y;
    })
  }

}