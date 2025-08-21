import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-stopwatch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stopwatch.component.html',
  styleUrl: './stopwatch.component.css'
})
export class StopwatchComponent {
  elapsedSeconds = 0;
  timerSub?: Subscription;
  laps: number[] = [];

  startTimer() {
    if (this.timerSub) return; // sudah jalan
    this.timerSub = interval(1000).subscribe(() => {
      this.elapsedSeconds++;
    });
  }

  stopTimer() {
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;
  }

  resetTimer() {
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.laps = [];
  }

  addLap() {
    this.laps.push(this.elapsedSeconds);
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
