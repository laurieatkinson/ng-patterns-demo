import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Pipe({name: 'dateToString'})
export class DateToStringPipe implements PipeTransform {
    transform(value: Date, dateFormat: string) {
        if (!UtilitiesService.isDate(value)) {
            return '';
        }
        if (dateFormat === 'shortDate') {
            dateFormat = 'MM/DD/YY';
        }
        value.setMinutes(0, 0, 0);
        return UtilitiesService.convertDateToString(value, dateFormat);
    }
}
