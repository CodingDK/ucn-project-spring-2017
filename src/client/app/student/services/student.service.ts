import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class StudentService {    

    constructor(private http: Http, private router: Router) {

    }

    getLessons() {
        //return true;
    }     

    // Implement a method to handle errors if any
    private handleError(error: any): void {
        console.error('StudentService - An error occurred', error);
        if (error.status === 401) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        }
    }
}