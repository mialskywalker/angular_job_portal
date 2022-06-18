import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Posting } from "../_models/posting";

const baseUrl = `${environment.apiUrl}/posts`;

@Injectable({ providedIn: 'root' })
export class PostingService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Posting[]>(baseUrl);
    }

    getById(postId: number) {
        return this.http.get<Posting>(`${baseUrl}/${postId}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(postId: number, params: any) {
        return this.http.put(`${baseUrl}/${postId}`, params);
    }

    delete(postId: number) {
        return this.http.delete(`${baseUrl}/${postId}`);
    }
}