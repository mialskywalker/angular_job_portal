export class Posting {
    postId: number;
    postTitle: string;
    postDescription: string;
    postLikes: number;
    postType: string;
    postCategory: string;
    postApplicants: Array<number> = [];
    postApproved: Array<number> = [];
    isDeleting: boolean = false;
    isActive: boolean = false;
    canApply: boolean = false;
}