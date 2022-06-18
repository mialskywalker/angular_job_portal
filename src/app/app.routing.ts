import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { RegisterComponent } from './login/register.component';

const EditModule = () => import('./edit/edit.module').then(x => x.EditModule);
const PostingModule = () => import('../app/postings/postings.module').then(x => x.PostingsModule);
const AppliedPostingModule = () => import('../app/applied_postings/applied-postings.module').then(x => x.AppliedPostingsModule);

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'edit',
        loadChildren: EditModule
    },
    {
        path: 'posts',
        loadChildren: PostingModule
    },
    {
        path: 'applied',
        loadChildren: AppliedPostingModule
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);