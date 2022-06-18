import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

import { UserService } from '../_services/user.service';

@Component({ 
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.css']    
})
export class LayoutComponent implements OnInit{ 
    users = null as any;
    currentUser: User;
    loading = false;
    userFromApi: User;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService
        ) {
            this.currentUser = this.authenticationService.currentUserValue;
        }

    ngOnInit() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }
    

    deleteUser(id: number) {
        const user = this.users.find((x: { id: number; }) => x.id === id);
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter((x: { id: number; }) => x.id !== id));
    }
}