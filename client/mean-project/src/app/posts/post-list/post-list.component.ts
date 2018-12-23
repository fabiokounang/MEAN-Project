import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscription: Subscription;
  isLoad = false;
  totalPost = 10;
  pageOptions = [2, 4, 6, 10];
  postPerPage = 2;

  constructor (private postService: PostService, private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit () {
    this.isLoad = true;
    this.postService.getPost()
      .pipe(map((response :any) => {
        return response.data.map((value) => {
          return {
            id: value._id,
            title: value.title,
            content: value.content,
            image: value.image
          }
        })
      })).subscribe((transformPost: any) => {
      if (transformPost) {
        this.posts = transformPost;
        this.postService.saveData(this.posts);
        this.isLoad = false;
      } else {
        console.log(transformPost, 'error')
      }
    });

    this.subscription = this.postService.postUpdated.subscribe((data) => {
      this.posts.push(data);
    })
  }

  onDelete (post) {
    this.postService.deletePost(post).subscribe((response: any) => {
      if (response.data) {
        const updatedPost = this.posts.filter(post => post.id !== response.data);
        this.posts = updatedPost;
      } else {
        console.log(response, 'error');
      }
    })
  }

  onEdit (post) {
    this.router.navigate(['/edit', post.id]);
  }

  onPageChange (event) {
    console.log(event);
  }

  ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}