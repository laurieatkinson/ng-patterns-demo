import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MegaMenuModule } from 'primeng/components/megamenu/megamenu';
import { TieredMenuModule } from 'primeng/components/tieredmenu/tieredmenu';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { MenuModule, MenuItem } from 'primeng/primeng';
import { PartsMenuComponent } from './parts-menu.component';

describe('PartsMenuComponent', () => {
    let component: PartsMenuComponent;
    let fixture: ComponentFixture<PartsMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MenuModule,
                MegaMenuModule,
                TieredMenuModule,
                PanelMenuModule
            ],
            declarations: [
                PartsMenuComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartsMenuComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('can show popup', () => {
        component.type = 'popup';
        fixture.detectChanges();
        expect(component.popupMenu).toBeTruthy();
        expect(component.logoutMenu).toBeFalsy();
    });

    it('can show logout menu', () => {
        component.type = 'logout';
        fixture.detectChanges();
        expect(component.popupMenu).toBeFalsy();
        expect(component.logoutMenu).toBeTruthy();
    });
});
