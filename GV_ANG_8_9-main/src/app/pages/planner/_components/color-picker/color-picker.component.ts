import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input() label: string;
  @Input() color;
  @Input() disabled: boolean;
  @Input() position?: string;
  @Output() colorChange = new EventEmitter();
  cpPosition: string;
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'color-picker',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/color-picker.svg'));
  }

  ngOnInit(): void {
    this.cpPosition = this.position ? this.position : 'bottom-left';
  }

  handleChangeColor(value) {
    this.colorChange.emit(value);
  }
}
