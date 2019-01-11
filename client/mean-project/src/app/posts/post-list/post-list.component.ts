import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscription: Subscription;
  isLoad = false;
  totalPost = 0;
  pageOptions = [2, 4, 6, 10];
  postPerPage = 2;
  currentPage = 1;
  isAuthenticate: boolean = false;
  userId: string = '';
  subscriptionAuth: Subscription;

  constructor (
    private postService: PostService, 
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit () {
    this.userId = this.authService.userId;
    this.isLoad = true; // untuk loader , true berarti muncul
    this.getPostData();

    this.subscription = this.postService.postUpdated.subscribe((data) => {
      this.posts.push(data);
    })

    this.isAuthenticate = this.authService.isAuthenticate;
    this.subscriptionAuth = this.authService.authListener.subscribe((condition) => {
      this.isAuthenticate = condition;
      this.userId = this.authService.userId;
    })
  }

  getPostData () {
    this.postService.getPost(this.postPerPage, this.currentPage).pipe(map((response :any) => { // getPost api dengan map response nya (hanya id saja yang diubah, dari _id jadi id)
      if (response.total) {
        this.totalPost = response.total;
      }
      return response.data.map((value) => {
        return {
          id: value._id,
          title: value.title,
          content: value.content,
          image: value.image,
          creator: value.creator
        }
      })
    })).subscribe((transformPost: any) => { // subscribe transformPost
      if (transformPost) {
        this.posts = transformPost;
        this.postService.saveData(this.posts);
        this.isLoad = false;
      } else {
        console.log(transformPost, 'error')
      }
    });
  }

  onDelete (post) {
    this.isLoad = true;
    this.postService.deletePost(post).subscribe((response: any) => {
      if (response.data) {
        const updatedPost = this.posts.filter(post => post.id !== response.data);
        this.posts = updatedPost;
        this.totalPost--;
        this.isLoad = false;
        // this.getPostData();
      } else {
        console.log(response, 'error');
      }
    }, (err) => {
      this.isLoad = false;
    })
  }

  onEdit (post) {
    this.router.navigate(['/edit', post.id]);
  }

  onPageChange (event) {
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;
    this.isLoad = true; // untuk loader , true berarti muncul
    this.getPostData();
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
    this.subscriptionAuth.unsubscribe();
  }
}