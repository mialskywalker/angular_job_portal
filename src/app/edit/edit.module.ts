import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { LayoutComponent } from './layout.component';
import { EditComponent } from './edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EditRoutingModule
    ],
    declarations: [
        LayoutComponent,
        EditComponent
    ]
})
export class EditModule { }