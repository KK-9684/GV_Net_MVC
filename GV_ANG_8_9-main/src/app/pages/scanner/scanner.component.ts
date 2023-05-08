import { Component } from '@angular/core';
import { PlayService } from './play.service';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {

  constructor(private _service: PlayService) {
    this.getCustomLayouts();
    this.getStartupData();
    this.getStrategies();
  }

  getCustomLayouts(): void {
    this._service.getCustomLayouts().subscribe(() => {});
  }

  getStartupData(): void {
    this._service.getStartupData().subscribe(() => {});
  }

  getStrategies(): void {
    this._service.getStrategies().subscribe(() => {});
  }

}
