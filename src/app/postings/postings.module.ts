import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostingsRoutingModule } from '../postings/postings-routing.module';
import { PostingsLayoutComponent } from '../postings/layout.component';
import { PostingsListComponent } from '../postings/list.component';
import { PostingsAddEditComponent } from '../postings/add-edit.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApplicantComponent } from '../applicant/applicant.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PostingsRoutingModule,
        MatCardModule,
        MatGridListModule,
        MatToolbarModule,
        FlexLayoutModule
    ],
    declarations: [
        PostingsLayoutComponent,
        PostingsListComponent,
        PostingsAddEditComponent,
        ApplicantComponent
    ]
})
export class PostingsModule { }