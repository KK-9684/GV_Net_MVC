import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-note-popup',
  templateUrl: './user-note-popup.component.html',
  styleUrls: ['./user-note-popup.component.scss']
})
export class UserNotePopupComponent implements OnInit {

  constructor() { }
  @Input() userPredictions;
  @Input() currentNoteId;
  ngOnInit(): void {
  }

}
