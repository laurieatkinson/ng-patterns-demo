import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ValidationService } from './services/validation.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [
    ],
    providers: [
        ValidationService
    ],
    exports: [
    ]
})
export class ValidationModule { }

