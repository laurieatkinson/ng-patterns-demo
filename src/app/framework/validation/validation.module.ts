import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ValidationService } from './services/validation.service';
import { DisplayErrorPipe } from './pipes/display-error.pipe';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [
        DisplayErrorPipe
    ],
    providers: [
        ValidationService
    ],
    exports: [
        DisplayErrorPipe
    ]
})
export class ValidationModule { }

