import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { interval, Observable, switchMap, take, timer, takeUntil } from 'rxjs';
export enum TimerType {
  /** افزایشی */
  Additive = 1,

  /** کاهشی */
  Reduction = 2
}

export interface Timer {
  minutes: number;
  seconds: number;
}


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnChanges {
  @Input() time: Timer = { minutes: 2, seconds: 0 };
  @Input() type:  TimerType.Reduction;
  @Input() class: string = undefined;

  @Output() onExpire = new EventEmitter();

  private timerInterval: any = undefined;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.SetTimerRxjs();
  }  

  private SetTimerRxjs(): void {
    let duration: number = undefined;

    if (!!this.time.minutes)
      duration = this.time.minutes * 60;
    else if (!!this.time.seconds)
      duration = this.time.seconds;


    interval(1000).pipe(take(duration)).subscribe(value => {
      if (!!this.time.seconds) {
        this.time.seconds -= 1;

        if (value === duration - 1)
          this.onExpire.emit();
      }
      else if (!!this.time.minutes) {
        this.time.minutes -= 1;
        this.time.seconds = 59;
      }
    })
  }
}
