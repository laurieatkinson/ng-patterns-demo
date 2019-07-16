import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from '../../../framework/services/auth.service';
import { MenuComponent } from '../../../shared/directives/menu/menu.component';

@Component({
    selector: 'la-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent {
    showSearch = false;
    userMenuItems: Array<MenuItem> = [
        {
            label: 'logout',
            command: () => { this.signOut(); }
        }
    ];
    @ViewChild('userMenu') userMenu: MenuComponent;

    constructor(private authService: AuthService, private router: Router) {
    }

    toggleUserMenu(event) {
        this.userMenu.toggle(event);
        window.scrollTo(0, 0);
    }

    loggedIn() {
        return this.authService.isUserAuthenticated;
    }

    userName() {
        return this.authService.currentUserName;
    }

    signIn() {
        this.authService.logIn();
    }

    signOut() {
        this.router.navigate(['/logout']);
    }
}
