import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'displayError'
})
export class DisplayErrorPipe implements PipeTransform {

    transform(value: Object): Array<string> {
        if (!value) {
            return null;
        }
        const errorMessages: Array<string> = [];
        Object.keys(value).forEach(key => {
            if (!errorMessages.includes(value[key])) {
                errorMessages.push(value[key]);
            }
        });

        return errorMessages;
    }

}
