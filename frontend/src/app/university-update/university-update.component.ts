import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-university-update',
  templateUrl: './university-update.component.html',
  styleUrls: ['./university-update.component.css'],
})
export class universityUpdateComponent implements OnInit {
  university_new = {
    university_id: 0,
    Price: '',
    EndDate: '',
    StartDate: '',
    CourseDescription: '',
    Currency: '',
    Name: '',
    Course: '',
    Country: '',
    City: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.university_new.university_id = +params['id']; // Convert to number
      console.log('University ID:', this.university_new.university_id); // Debugging
      this.http
        .get<any>(
          ` https://backend-1-pyuh.onrender.com/university/${this.university_new.university_id}`
        )
        .subscribe(
          (university) => {
            console.log('University:', university); // Debugging

            this.university_new.Price = university.Price;
            this.university_new.StartDate = university.StartDate;
            this.university_new.EndDate = university.EndDate;
            this.university_new.CourseDescription =
              university.CourseDescription;
            this.university_new.Name = university.data.university;
            this.university_new.Course = university.data.course_name;
            this.university_new.Country = university.data.country;
            this.university_new.City = university.data.city;
            this.university_new.Currency = university.data.currency;
          },
          (error) => {
            console.error('Error fetching university:', error); // Debugging
          }
        );
    });
  }

  onSubmit(): void {}
  updateData(id: number): void {
    this.university_new.StartDate = this.formatDate(
      this.university_new.StartDate
    );

    this.http
      .put<any>(
        ` https://backend-1-pyuh.onrender.com/university/${id}`,
        this.university_new
      )
      .pipe(
        catchError((error) => {
          alert('All fields are required. Please fill in all fields.');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log(this.university_new.EndDate);
          alert('Updated Successfully!');
          this.router.navigate(['/list']);
        }
      });
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
