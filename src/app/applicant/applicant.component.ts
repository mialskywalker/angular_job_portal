import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs";
import { Posting } from "../_models/posting";
import { User } from "../_models/user";
import { AlertService } from "../_services/alert.service";
import { PostingService } from "../_services/posting.service";
import { UserService } from "../_services/user.service";

@Component({
    templateUrl: 'applicant.component.html',
    styleUrls: ['applicant.component.css']
})
export class ApplicantComponent implements OnInit {
    postId: number;
    appliedUsers = null as any;
    selectedApplicant?: User;
    applyForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private postingService: PostingService,
        private alertService: AlertService,
        private router: Router
    ) {
        
    }

    ngOnInit() {
        this.postId = this.route.snapshot.params['postId'];
        this.userService.getAll()
            .pipe(first())
            .subscribe(appliedUsers => this.appliedUsers = appliedUsers);
        console.log(this.postId);
        this.postId = Number(this.postId);
    }

    onSelect(applicant: User): void {
        this.selectedApplicant = applicant;
    }

    typeOf(value: any) {
        return typeof value;
    }

    applyUser(id: number){
        this.applyForm = this.formBuilder.group({
            postApproved: [this.selectedApplicant?.id]
        });

        this.postingService.update(this.postId, this.applyForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Approved', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
    }

    declineUser(id: number){
        this.applyForm = this.formBuilder.group({
            postApproved: []
        });

        this.postingService.update(this.postId, this.applyForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Declined', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
    }
}