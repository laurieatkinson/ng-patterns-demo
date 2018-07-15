import * as moment from 'moment';
import * as _ from 'lodash';

export interface Dictionary<T> extends _.Dictionary<T> {
}

export class UtilitiesService {

    static cloneDeep(obj: any) {
      // Below approach does not properly clone Date objects.
      // JSON.parse(JSON.stringify(obj));
      const clonedObj = _.cloneDeep(obj);
      return  clonedObj;
    }

    static omitFunctions(obj: any) {
        return _.omit(obj, _.functions(obj));
    }

    static isEqual(obj1: any, obj2: any) {
        return _.isEqual(obj1, obj2);
    }

    static isValidDateString(date: string) {
        if (!(typeof date === 'string') || date.length !== 10) {
            return false;
        }

        if (moment(date, 'MM/DD/YYYY').isValid()) {
            return true;
        }

        return this.isDate(this.convertStringToDate(date, 'MM/DD/YYYY'));
    }

    static isDate(date: Date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    static getValidDateFormat(dateString: string) {
        const formats = ['YYYY-MM-DD', 'MM-DD-YYYY', 'MM/DD/YYYY'];
        let dateFormat: string = null;
        if (dateString && dateString.length === 10) {
            formats.forEach(format => {
                if (moment(dateString, format).isValid()) {
                    dateFormat = format;
                }
            });
        }
        return dateFormat;
    }

    static isToday(date: Date) {
        const today = moment();
        return moment(today, 'MM-DD-YYYY').isSame(date, 'day');
    }

    static addDays(date: Date, days: number) {
        const newDate = moment(date).add(days, 'day');
        return newDate.toDate();
    }

    static subtractDays(date: Date, days: number) {
        const newDate = moment(date).subtract(days, 'day');
        return newDate.toDate();
    }

    static convertDateToString(date: Date, format: string) {
        return moment(date).format(format);
    }

    static convertStringToDate(date: string, format?: string) {
        if (format) {
            return moment(date, format).toDate();
        } else {
            format = this.getValidDateFormat(date);
            if (format) {
                return moment(date, format).toDate();
            }
        }
        return null;
    }
    static isSameDate(date1: Date, date2: Date) {
        return moment(date1).isSame(moment(date2), 'day');
    }

    // Return true if thisDate is before anotherDate
    static isBeforeDate(thisDate: Date, anotherDate: Date) {
        return moment(thisDate).isBefore(moment(anotherDate), 'day');
    }

    // Return true if thisDate is after anotherDate
    static isAfterDate(thisDate: Date, anotherDate: Date) {
        return moment(thisDate).isAfter(moment(anotherDate), 'day');
    }

    static isBeforeToday(date: Date) {
        return moment(date).isBefore(moment(), 'day');
    }

    static updateFromUTCToLocalTime(date: Date) {
        const now = new Date();
        const minuteOffset = now.getTimezoneOffset();
        date.setMinutes(date.getMinutes() + minuteOffset);
    }

    static sameListValues(list1: Array<any>, list2: Array<any>) {
        return _(list1).differenceWith(list2, _.isEqual).isEmpty();
    }

    static removeItemFromList(list: Array<any>, item: string, propertyName?: string) {
        let itemIndex = -1;

        if (!propertyName) {
            itemIndex = list.indexOf(item);
        } else {
            itemIndex = list.findIndex(listItem => {
                return listItem[propertyName] === item;
            });
        }
        list.splice(itemIndex, 1);
    }

    static fixTimeForDatePipeBug(value: Date) {
        // When time is 00:00:00, the date pipe thinks the date is yesterday
        // Changing it to 01:00:00 fixes the problem
        // https://github.com/angular/angular/issues/8319
        if (!value || !UtilitiesService.isDate(new Date(value))) {
            return '';
        }
        const fixedValue = new Date(value);
        if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
           fixedValue.setHours(1, 0, 0);
        }
        return fixedValue;
    }

    // Capitalize the first letter of each word
    static convertToProperCase(s: string) {
        return _.startCase(s);
    }

    currentdate() {
        const today = moment();
        today.set({hour: 0, minute: 0, second: 0, millisecond: 0});
        return today.toDate();
    }

    getFormattedDate(date: string | Date) {
        if (typeof date === 'string') {
            if (date.length >= 10) {
                date = date.substr(0, 10);
                return moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY');
            } else {
                return '';
            }
        }
        return moment(date).format('MM-DD-YYYY');
    }
}
