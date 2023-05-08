import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-highlight-popup',
  templateUrl: './highlight-popup.component.html',
  styleUrls: ['./highlight-popup.component.scss']
})
export class HighlightPopupComponent implements OnInit {

  @Input() highlightText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
