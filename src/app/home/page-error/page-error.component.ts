import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'la-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.scss']
})
export class PageErrorComponent implements OnInit {

  errorMessage = 'Error occurred';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
      this.route.queryParams.subscribe((params) => {
          let errorMessage = params['errorMessage'];
          if (!errorMessage) {
              errorMessage = params['errormessage'];
          }
          if (errorMessage && (<string>errorMessage).toLowerCase().indexOf('auth') !== -1) {
              this.errorMessage = 'Azure AD token has expired. Please logout and login again.';
          }
      });
  }

}
