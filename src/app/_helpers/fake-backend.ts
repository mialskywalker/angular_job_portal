import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";
import { User } from '../_models/user';
import { Role } from "../_models/role";
import { Posting } from "../_models/posting";

// const users: User[] = [
//     { id: 1, email: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
//     { id: 2, email: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
// ];

// users
const usersKey = 'example-users-key';
let users = JSON.parse(localStorage.getItem(usersKey) || '[]');

// postings

const postingKey = 'example-posting-key';
let postings = JSON.parse(localStorage.getItem(postingKey) || '[]');
// const postings: Posting[] = [
//     { postId: 1, postTitle: 'test', postDescription: 'test description', postLikes: 0, postType: 'part-time', postCategory: 'Office', postApplicants: [], postApproved: [], isDeleting: false}
// ];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                // users
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                // postings
                case url.endsWith('/posts') && method === 'GET':
                    return getPostings();
                case url.match(/\/posts\/\d+$/) && method === 'GET':
                    return getPostingById();
                case url.endsWith('/posts') && method === 'POST':
                    return createPosting();
                case url.match(/\/posts\/\d+$/) && method === 'PUT':
                    return updatePosting();
                case url.match(/\/posts\/\d+$/) && method === 'DELETE':
                    return deletePosting();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find((x: { email: any; password: any; }) => x.email === email && x.password === password);
            if (!user) return error('E-mail or password is incorrect');
            return ok({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                posts: user.posts,
                token: `fake-jwt-token.${user.id}`
            });
        }

        // USERS

        function getUsers() {
            // if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function register() {
            const user = body

            if (users.find((x: { email: any; }) => x.email === user.email)) {
                return error('User with this email "' + user.email + '" is already registered')
            }

            user.id = users.length ? Math.max(...users.map((x: { id: any; }) => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            // if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find((x: { id: number; }) => x.id === idFromUrl());
            return ok(user);
        }

        // helper functions

        function ok(body?: { token?: string; id: any; email: any, firstName: any; lastName: any; role: any; posts: any} | undefined) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message: any) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser()?.role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization')!.split('.')[1]);
            return users.find((x: { id: number; }) => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find((x: { id: number; }) => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }
            // delete user
        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter((x: { id: number; }) => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        // POSTINGS

        function postingOk(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500));
        }

        function basicDetails(posting: any) {
            const { postId, postTitle, postDescription, postLikes, postType, postCategory, postApplicants, postApproved } = posting;
            return { postId, postTitle, postDescription, postLikes, postType, postCategory, postApplicants, postApproved };
        }

        function newPostingId() {
            return postings.length ? Math.max(...postings.map((x: { postId: any; }) => x.postId)) + 1 : 1;
        }

        function getPostings() {
            return postingOk(postings.map((x: any) => basicDetails(x)));
        }

        function getPostingById() {
            const posting = postings.find((x: { postId: number; }) => x.postId === idFromUrl());
            return postingOk(basicDetails(posting));
        }

        function createPosting() {
            const posting = body;

            posting.postId = newPostingId();
            postings.push(posting);
            localStorage.setItem(postingKey, JSON.stringify(postings));

            return postingOk();
        }

        function updatePosting() {
            let params = body;
            let posting = postings.find((x: { postId: number; }) => x.postId === idFromUrl());

            Object.assign(posting, params);
            localStorage.setItem(postingKey, JSON.stringify(postings));

            return postingOk();
        }

        function deletePosting() {
            postings = postings.filter((x: { postId: number; }) => x.postId !== idFromUrl());
            localStorage.setItem(postingKey, JSON.stringify(postings));
            return postingOk();
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};