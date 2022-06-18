import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostingsLayoutComponent } from './layout.component';
import { PostingsListComponent } from './list.component';
import { PostingsAddEditComponent } from './add-edit.component';
import { ApplicantComponent } from '../applicant/applicant.component';

const routes: Routes = [
    {
        path: '', component: PostingsLayoutComponent,
        children: [
            { path: '', component: PostingsListComponent },
            { path: 'add', component: PostingsAddEditComponent },
            { path: 'edit/:postId', component: PostingsAddEditComponent },
            { path: 'applicants/:postId', component: ApplicantComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostingsRoutingModule { }