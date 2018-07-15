import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../framework/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'la-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    // check if posting object has unsaved changes
    this.logout();
  }

  logout() {
    this.authService.logOut();
  }

}
