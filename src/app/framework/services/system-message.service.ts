import { Injectable } from '@angular/core';
import { SystemMessageDataService } from './system-message-data.service';

type ModuleType = 'planRule' | 'common' | 'posting' | 'participant' | 'batch';

@Injectable()
export class SystemMessageService {
    private messages: Array<{ id: number, message: string }> = [];
    private tooltips: Array<{
        module: ModuleType,
        component: string,
        id: number,
        fieldName: string,
        tooltipText: string
    }> = [];

    constructor(private systemMessageDataService: SystemMessageDataService) {
    }

    getMessage(id: number, errorParameters?: Array<string>) {
        let message = `Invalid (Error: ${id})`;
        const match = this.messages.find(item => item.id === id);
        if (match) {
            message = match.message;
            if (errorParameters) {
                errorParameters.forEach((param, index) => {
                    const token = `{${index.toString()}}`;
                    message = message.replace(token, param);
                });
            }
        }
        return message;
    }

    getMessagesForComponent(ids: Array<number>) {
        const promise = new Promise<string>((resolve, reject) => {
            const promises: Array<Promise<string>> = [];
            ids.forEach((id) => {
                promises.push(this.lookupMessage(id));
            });
            Promise.all(promises).then(() => {
                resolve();
            })
            .catch(() => {
                resolve();
            });
        });
        return promise;
    }

    getTooltipsForComponent(component: string, moduleName: ModuleType = 'planRule') {
        const promise = new Promise<string>((resolve, reject) => {
            const index = this.tooltips.findIndex(item => {
                    return item.component === component &&
                           item.module === moduleName;
                });
            if (index > -1) {
                resolve();
            } else {
                this.systemMessageDataService.getTooltips(moduleName, component)
                    .then(tooltips => {
                        tooltips.forEach(tooltip => {
                            this.tooltips.push({
                                id: tooltip.messageId,
                                module: moduleName,
                                component: component,
                                fieldName: tooltip.fieldName,
                                tooltipText: tooltip.tooltipText
                            });
                        });
                        resolve();
                    }).catch((e) => {
                        resolve();
                    });
            }
        });
        return promise;
    }

    getTooltip(fieldName: string, component: string, moduleName: ModuleType = 'planRule') {
        let tooltip: string = null;
        const match = this.tooltips.find(item => {
            return item.fieldName === fieldName &&
                   item.component === component &&
                   item.module === moduleName;
        });
        if (match) {
            tooltip = match.tooltipText;
        }
        return tooltip;
    }

    private lookupMessage(id: number) {
        const promise = new Promise<string>((resolve, reject) => {
            const index = this.messages.findIndex(item => item.id === id);
            if (index > -1) {
                resolve();
            } else {
                this.systemMessageDataService.getMessage(id)
                    .then(msg => {
                        this.messages.push({ id: id, message: msg });
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
            }
        });
        return promise;
    }

}
