import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PostingService } from '../_services/posting.service';
import { Posting } from '../_models/posting';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';


@Component({ 
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.css']
 })
export class AppliedPostingsListComponent implements OnInit {
    postings!: Posting[];
    currentUser: User;
    submitted = false;
    likeForm: FormGroup;
    applyForm: FormGroup;

    constructor(
        private postingService: PostingService,
        private authenticationService: AuthenticationService,
        ) {
            // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
            this.currentUser = this.authenticationService.currentUserValue;
        }

    ngOnInit() {
        this.postingService.getAll()
            .pipe(first())
            .subscribe(postings => this.postings = postings);
    }


    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    
}