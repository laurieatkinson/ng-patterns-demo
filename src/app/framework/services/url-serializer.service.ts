import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    parse(url: string): UrlTree {
        return super.parse(url.toLowerCase());
    }
}
