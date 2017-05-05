import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';

@Injectable()
export class StudentService {
    //

    constructor(private http: Http, private router: Router) {

    }

    

    // Implement a method to handle errors if any
    private handleError(error: any): void {
        console.error('GithubService - An error occurred', error);
        if (error.status === 401) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        }
    }
}