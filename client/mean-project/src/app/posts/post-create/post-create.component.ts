import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from "rxjs/operators";
import { mimeType } from './mime-type.validators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  dataForm: FormGroup;
  idParam: any = null;
  mode: string = 'create';
  onePost: any = null;
  isLoad = false;
  imagePreview: any;
  constructor(
    private router: Router,
    private postService: PostService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit () {
    this.dataForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      image: new FormControl(null, {
        validators: [
          Validators.required
        ], 
        asyncValidators: [mimeType]
      }),
      content: new FormControl(null, Validators.required)
    })
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('id')) {
        this.mode = 'edit';
        this.idParam = param.get('id');
        this.postService.getOnePost(this.idParam).subscribe((response: any) => {
          if (response.status) {
            this.onePost = response.data;
            this.dataForm.patchValue({
              title: this.onePost.title,
              image: this.onePost.image,
              content: this.onePost.content
            })
            this.populateImage(this.dataForm.value.image)
          }
        })
      } else {
        this.mode = 'create';
        this.idParam = null;
      }
    })
  }

  populateImage (image) {
    this.imagePreview = image;
  }

  onUpload (event: Event) {
    let file =  (event.target as HTMLInputElement).files[0];
    this.dataForm.patchValue({
      image: file
    })
    this.dataForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  onSavePost () {
    if (this.dataForm.valid) {
      if (this.mode === 'create') {
        const objPost = new FormData();
        objPost.append('title', this.dataForm.value.title);
        objPost.append('content', this.dataForm.value.content);
        objPost.append('image', this.dataForm.value.image, this.dataForm.value.title);
        this.postService.addPost(objPost).subscribe((response: any) => {
          if (response.status) {
            this.dataForm.reset();
            this.isLoad = true;
            this.router.navigate(['/']);
          }
        });
      } else {
        let postData: any;
        if (typeof this.dataForm.value.image !== 'object') {
          postData = {
            id: this.idParam,
            title: this.dataForm.value.title,
            content: this.dataForm.value.content,
            image: '',
            creator: null
          }
        } else {
          postData = new FormData();
          postData.append('id', this.idParam);
          postData.append('title', this.dataForm.value.title);
          postData.append('content', this.dataForm.value.content);
          postData.append('image', this.dataForm.value.image, this.dataForm.value.title);
        }
        this.postService.updatePost(this.idParam, postData).subscribe((response: any) => {
          if (response.status) {
            this.dataForm.reset();
            this.postService.saveData(this.postService.posts);
            this.isLoad = true;
            this.router.navigate(['/']);
          }
        });
      }
    }
  }
}