import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class PostService {
  apiString = environment.apiUrl;
  posts: Post[] = [];
  postUpdated = new Subject<Post>();
  constructor (private http: HttpClient) {}

  saveData (posts) {
    this.posts = posts;
  }

  getPost (limit: number, page: number) {
    const queryParams = `?limit=${limit}&page=${page}`;
    return this.http.get<{status: boolean, message: string, data: Post[]}>(this.apiString + 'api/posts' + queryParams);
  }

  getOnePost(id: string) {
    return this.http.get<{status: boolean, message: string, data: Post}>(this.apiString + 'api/posts/' + id);
  }

  addPost (post) {
    return this.http.post<{status: boolean, message: string, data: Post}>(this.apiString + 'api/posts', post);
  }

  updatePost (id: string, post) {
    return this.http.put<{status: boolean, message: string, data: any}>(this.apiString + 'api/posts/' + id, post);
  }

  deletePost (post: Post) {
    return this.http.delete<{status: boolean, message: string, data: any}>(this.apiString + 'api/posts/' + post.id);
  }
}