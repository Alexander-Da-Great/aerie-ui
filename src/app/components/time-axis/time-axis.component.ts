import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import {
  getDoyTimestamp,
  getSvgMousePosition,
  hideTooltip,
  showTooltip,
} from '../../functions';
import { TimeRange } from '../../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-time-axis',
  styleUrls: ['./time-axis.component.css'],
  templateUrl: `./time-axis.component.html`,
})
export class TimeAxisComponent implements AfterViewInit, OnChanges {
  @Input()
  height = 60;

  @Input()
  marginLeft = 70;

  @Input()
  marginRight = 70;

  @Input()
  marginTop = 10;

  @Input()
  maxTimeRange: TimeRange = { start: 0, end: 0 };

  @Input()
  viewTimeRange: TimeRange = { start: 0, end: 0 };

  @Output()
  updateViewTimeRange: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();

  @ViewChild('axisX', { static: true })
  axisX: ElementRef<SVGGElement>;

  @ViewChild('brush', { static: true })
  brush: ElementRef<SVGGElement>;

  public drawHeight: number = this.height;
  public drawWidth: number;
  public marginBottom = 30;

  constructor(private elRef: ElementRef) {
    this.elRef.nativeElement.style.setProperty('--height', `${this.height}px`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let shouldRedraw = false;
    this.setDrawBounds();

    if (changes.maxTimeRange && !changes.maxTimeRange.isFirstChange()) {
      shouldRedraw = true;
    }

    if (changes.viewTimeRange && !changes.viewTimeRange.isFirstChange()) {
      shouldRedraw = true;
    }

    if (shouldRedraw) {
      this.redraw();
    }
  }

  ngAfterViewInit(): void {
    d3.select(this.brush.nativeElement).on('mousemove', () => {
      this.showTooltip(d3.event);
    });

    d3.select(this.brush.nativeElement).on('mouseleave', () => {
      hideTooltip();
    });

    this.redraw();
  }

  drawXAxis(): void {
    const x = this.getXScale();

    const xAxis = d3
      .axisBottom(x)
      .ticks(5)
      .tickFormat((date: Date) => getDoyTimestamp(date.getTime(), false))
      .tickSizeInner(-this.drawHeight)
      .tickPadding(10);

    d3.select(this.axisX.nativeElement)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px');
  }

  drawXBrush(): void {
    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.drawWidth, this.drawHeight],
      ])
      .on('start', () => {
        this.showTooltip(d3.event.sourceEvent);
      })
      .on('brush', () => {
        this.showTooltip(d3.event.sourceEvent);
      })
      .on('end', () => {
        this.xBrushEnd();
      });

    const brush = d3.select(this.brush.nativeElement).call(xBrush);
    brush.call(xBrush.move, null);
  }

  getDomain(): Date[] {
    return [
      new Date(this.viewTimeRange.start),
      new Date(this.viewTimeRange.end),
    ];
  }

  getXScale(): d3.ScaleTime<number, number> {
    return d3
      .scaleTime()
      .domain(this.getDomain())
      .rangeRound([0, this.drawWidth]);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resize();
  }

  resize(): void {
    this.redraw();
  }

  redraw(): void {
    this.setDrawBounds();
    this.drawXAxis();
    this.drawXBrush();
  }

  setDrawBounds(): void {
    this.drawHeight = this.height - this.marginTop - this.marginBottom;
    this.drawWidth =
      this.elRef.nativeElement.clientWidth - this.marginLeft - this.marginRight;
  }

  showTooltip(event: MouseEvent | null): void {
    if (event) {
      const { x } = getSvgMousePosition(this.brush.nativeElement, event);
      const xScale = this.getXScale();
      const unixEpochTime = xScale.invert(x).getTime();
      const doyTimestamp = getDoyTimestamp(unixEpochTime);
      showTooltip(event, doyTimestamp, this.drawWidth); // Not recursive!
    }
  }

  xBrushEnd(): void {
    if (!d3.event.sourceEvent) {
      return;
    }
    if (!d3.event.selection) {
      return;
    }

    const x = this.getXScale();
    const [start, end] = d3.event.selection.map(x.invert);

    this.updateViewTimeRange.emit({
      end: end.getTime(),
      start: start.getTime(),
    });
  }
}

@NgModule({
  declarations: [TimeAxisComponent],
  exports: [TimeAxisComponent],
})
export class TimeAxisModule {}
