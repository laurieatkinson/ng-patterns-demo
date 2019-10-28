import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../framework/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'la-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {

  constructor(private authService: AuthService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.authService.logout();
  }

}
