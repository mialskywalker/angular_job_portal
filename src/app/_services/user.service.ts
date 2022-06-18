import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        this.currentUser = this.currentUserSubject.asObservable();
     }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }
    update(id: number, params: any) {
        console.log(this.currentUserValue);
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map((x: any) => {
                // update stored user if the logged in user updated their own record
                if (id == this.currentUserValue.id) {
                    // update local storage
                    const user = { ...this.currentUserValue, ...params };
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.currentUserSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map((x: any) => {
                // auto logout if the logged in user deleted their own record
                // if (id == this.userValue.id) {
                //     this.logout();
                // }
                this.logout();
            }));
    }
}