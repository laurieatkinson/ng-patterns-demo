import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './framework/services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { PageErrorComponent } from './home/page-error/page-error.component';
import { LogOutComponent } from './home/log-out/log-out.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'error', component: PageErrorComponent },
    { path: 'logout', component: LogOutComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
