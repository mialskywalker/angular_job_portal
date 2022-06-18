import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { EditComponent } from './edit.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'edit/:id', component: EditComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditRoutingModule { }