import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-odd-popup',
  templateUrl: './pre-odd-popup.component.html',
  styleUrls: ['./pre-odd-popup.component.scss']
})
export class PreOddPopupComponent implements OnInit {

  @Input() preMatchOdds;

  constructor() { }

  ngOnInit(): void {
  }

}
