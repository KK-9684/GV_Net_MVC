import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  layouts: any[] = [];
  constructor(private router: Router, private _store: StateService) {
  }

  ngOnInit(): void {
    this.getCustomLayouts();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }

  isScanner(): boolean {
    return this.router.url.includes('scanner');
  }

  getCustomLayouts(): void {
    this._store.scannerLayouts.subscribe(layouts => {
      this.layouts = layouts;
    });
  }
}
