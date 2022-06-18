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
export class PostingsListComponent implements OnInit {
    postings!: Posting[];
    currentUser: User;
    submitted = false;
    likeForm: FormGroup;
    applyForm: FormGroup;
    applicantForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private postingService: PostingService,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute
        ) {
            // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
            this.currentUser = this.authenticationService.currentUserValue;
        }

    ngOnInit() {
        this.postingService.getAll()
            .pipe(first())
            .subscribe(postings => this.postings = postings);
    }

    likePosting(id: number){
        const posting = this.postings.find(x => x.postId === id);
        if (!posting) return;
        this.likeForm = this.formBuilder.group({
            postLikes: [posting.postLikes + 1]
        });
        posting.isActive = true;
        this.postingService.update(posting.postId, this.likeForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Post liked', { keepAfterRouteChange: true });
                // this.router.navigate(['../posts/'], { relativeTo: this.route });
                window.location.reload();
            })
    }

    applyPosting(id: number){
        const posting = this.postings.find(x => x.postId === id);
        if (!posting) return;
        if (!(posting.postId in this.currentUser.posts)){
            let arr = this.currentUser.posts;
            let userApply = posting.postApplicants;
            

            arr.push(posting.postId);
            userApply.push(this.currentUser.id)

            this.applyForm = this.formBuilder.group({
                posts: [arr]
            });
            this.applicantForm = this.formBuilder.group({
                postApplicants: [userApply]
            })


            this.userService.update(this.currentUser.id, this.applyForm.value)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Post applied', { keepAfterRouteChange: true });
                    this.router.navigate(['../posts'], { relativeTo: this.route });
             })
             this.postingService.update(posting.postId, this.applicantForm.value)
             .pipe(first())
             .subscribe(() => {
                 this.alertService.success('Post applied', { keepAfterRouteChange: true });
                 this.router.navigate(['../posts'], { relativeTo: this.route });
                 window.location.reload();
             })

        }else{

            posting.canApply = true;
            return;
        } 
    }

    deletePosting(id: number) {
        const posting = this.postings.find(x => x.postId === id);
        if (!posting) return;
        posting.isDeleting = true;
        this.postingService.delete(id)
            .pipe(first())
            .subscribe(() => this.postings = this.postings.filter(x => x.postId !== id));
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    
}