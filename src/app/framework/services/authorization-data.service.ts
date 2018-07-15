import { DataService } from './data.service';
import { ActionCode } from '../models/authorization.types';

export class AuthorizationDataService extends DataService {

    getPermissions(): Promise<Array<ActionCode>> {
        const endpoint = `${this.apiServer.metadata}authorizations`;
        return this.get<Array<ActionCode>>(endpoint);
    }
}
