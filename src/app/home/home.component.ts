import { Component } from '@angular/core';
import { AuthService } from '../framework/services/auth.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(private authService: AuthService,
                private router: Router) {
        const originalRoute = this.authService.getOriginalRoute();
        if (originalRoute && originalRoute !== window.location.pathname &&
            !originalRoute.endsWith('home')) {
            this.authService.clearOriginalRoute();
            this.router.navigateByUrl(originalRoute);
        }
    }
}
