import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit {
  constructor(private route: Router) {}
  routeActivated = '';

  ngOnInit(): void {
    this.loadReallyPage();
  }

  loadReallyPage() {
    if (this.route.url.endsWith('user-account/user-dashboard'))
      this.routeActivated = 'user-dashboard';

    if (this.route.url.endsWith('user-account/my-cars'))
      this.routeActivated = 'my-cars';

    if (this.route.url.endsWith('user-account/to-sell-car'))
      this.routeActivated = 'to-sell-car';
  }
}
