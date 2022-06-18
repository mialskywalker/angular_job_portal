import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppliedPostingsListComponent } from './list.component';
import { AppliedPostingsLayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: AppliedPostingsLayoutComponent,
        children: [
            { path: '', component: AppliedPostingsListComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppliedPostingsRoutingModule { }