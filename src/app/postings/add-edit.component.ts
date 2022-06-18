import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { PostingService } from '../_services/posting.service';

@Component({ 
    templateUrl: 'add-edit.component.html',
    styleUrls: ['add-edit.component.css']
})
export class PostingsAddEditComponent implements OnInit {
    addForm: FormGroup;
    editForm: FormGroup;
    postId: number;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private postingService: PostingService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.postId = this.route.snapshot.params['postId'];

        this.isAddMode = !this.postId;
        
        
        this.addForm = this.formBuilder.group({
            postTitle: ['', Validators.required],
            postDescription: ['', Validators.required],
            postLikes: [0],
            postType: ['', Validators.required],
            postCategory: ['', Validators.required],
            postApplicants: [[]],
            postApproved: [[]]
        });
        this.editForm = this.formBuilder.group({
            postTitle: ['', Validators.required],
            postDescription: ['', Validators.required],
            postType: ['', Validators.required],
            postCategory: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.postingService.getById(this.postId)
                .pipe(first())
                .subscribe(x => this.editForm.patchValue(x));
        }
    }

    // // convenience getter for easy access to form fields
    // get f() { return this.addForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.addForm.invalid && this.editForm.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createPosting();
        } else {
            this.updatePosting();
        }
    }

    private createPosting() {
        this.postingService.create(this.addForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Post added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updatePosting() {
        this.postingService.update(this.postId, this.editForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Post updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

}