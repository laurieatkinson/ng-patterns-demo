import { Component, Input, ViewEncapsulation, ViewChild, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Menu, MenuItem } from 'primeng/primeng';

@Component({
    selector: 'la-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit, OnChanges {
    @Input() items: MenuItem[];
    @Input() type: string;
    @Input() orientation = 'horizontal';
    filteredItems: MenuItem[];

    @ViewChild('popupMenu', { static: false }) popupMenu: Menu;
    @ViewChild('logoutMenu', { static: false }) logoutMenu: Menu;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.filterMenuItems();
    }

    ngOnChanges() {
        this.filterMenuItems();
    }

    toggle(event) {
        if (this.popupMenu) {
            this.popupMenu.toggle(event);
        }
        if (this.logoutMenu) {
            this.logoutMenu.toggle(event);
        }
    }

    filterMenuItems() {
        // Need to detect changes in the menu to trigger call to ngOnChanges(),
        // but do not trigger while already building the menu
        this.changeDetectorRef.detach();
        const filteredItems = <MenuItem[]>this.removeNonVisibleItems(this.items);
        this.filteredItems = filteredItems;
        this.changeDetectorRef.reattach();
    }

    private removeNonVisibleItems(menu: MenuItem | MenuItem[]) {
        if (menu instanceof Array) {
            menu = menu.filter(item => {
                return item.visible === undefined || item.visible;
            }).map((item) => {
                return this.removeNonVisibleItems(item);
            });
        } else if (menu && menu.items) {
            menu.items = (<MenuItem[]>menu.items).filter(item => {
                return item.visible === undefined || item.visible;
            }).map((item) => {
                return this.removeNonVisibleItems(item);
            });
        }
        return menu;
    }
}
