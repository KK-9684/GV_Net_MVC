import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stats-number-spinner',
  templateUrl: './stats-number-spinner.component.html',
  styleUrls: ['./stats-number-spinner.component.scss'],
})
export class StatsNumberSpinnerComponent implements OnChanges {
  upButton: any;
  downButton: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'color-picker',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/color-picker.svg'));
  }

  @Input() value: number;
  @Output() valueChange = new EventEmitter<number>();
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();
  @Input() name: string;
  @Input() updateStrategy: Function;
  @Input() disabled: boolean;
  ngOnChanges(changes: SimpleChanges): void {
    this.updateSpinnerColor();
  }
  // to prevent keep increasing
  ngAfterViewInit() {
    this.upButton=this.elRef.nativeElement.querySelectorAll('.increase')[0];
    this.downButton=this.elRef.nativeElement.querySelectorAll('.decrease')[0];

    this.renderer.listen(this.upButton, 'mouseleave', ($event: any) => {
      //  console.log('onmouseleave', $event);
       let mouseUpEvent: Event = new MouseEvent('mouseup');
       this.upButton.dispatchEvent(mouseUpEvent);
   });

   this.renderer.listen(this.downButton, 'mouseleave', ($event: any) => {
      //  console.log('onmouseleave', $event);
       let mouseUpEvent: Event = new MouseEvent('mouseup');
       this.downButton.dispatchEvent(mouseUpEvent);
   });
  }


  handleValueChange(value) {
    this.valueChange.emit(value);
    this.updateStrategy();
  }

  handleColorChange(value) {
    this.colorChange.emit(value);
    this.updateStrategy();
    this.updateSpinnerColor();
  }

  updateSpinnerColor() {
    const spinnerElem = $('#' + this.name).first();
    const hexColor = parseInt(this.color.replace(/^#/, ''), 16);
    const complementaryHexColor = 0xffffff - hexColor;
    const complementaryHexString = `rgb(
      ${complementaryHexColor / 256 / 256},
      ${complementaryHexColor / 256 % 256},
      ${complementaryHexColor % 256})`;

    spinnerElem.find('span').css({
      'background-color': this.color,
      color: complementaryHexString,
    });
    spinnerElem.find('input').css({
      'background-color': this.color,
      color: complementaryHexString
    });
  }
}
