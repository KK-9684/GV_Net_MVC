import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-prediction-popup',
  templateUrl: './user-prediction-popup.component.html',
  styleUrls: ['./user-prediction-popup.component.scss']
})
export class UserPredictionPopupComponent implements OnInit {

  constructor() { }
  @Input() currentPredictionId;
  @Input() userPredictions;
  ngOnInit(): void {
  }

}
