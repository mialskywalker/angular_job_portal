import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppliedPostingsLayoutComponent } from './layout.component';
import { AppliedPostingsListComponent } from './list.component';

import { AppliedPostingsRoutingModule } from './applied-postings-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppliedPostingsRoutingModule,
        MatCardModule,
        MatGridListModule,
        MatToolbarModule,
        FlexLayoutModule
    ],
    declarations: [
        AppliedPostingsLayoutComponent,
        AppliedPostingsListComponent,
    ]
})
export class AppliedPostingsModule { }