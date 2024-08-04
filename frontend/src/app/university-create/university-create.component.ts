import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-university-create',
  templateUrl: './university-create.component.html',
  styleUrls: ['./university-create.component.css']
})
export class universityCreateComponent implements OnInit  {
  university = {
    university_id: 0,
    University: '',
    City: '',
    Country: '',
    CourseName: '',
    CourseDescription: '',
    StartDate: '',
    EndDate: '',
    Price: 0.0,
    Currency: '',
    
  };

  constructor(private http: HttpClient,private router: Router) {}
 
  ngOnInit(): void {
    this.university.university_id = this.generateRandomId();
  
  }

  generateRandomId(): number {
    return Math.floor(10000000000 + Math.random() * 90000000000);
   
  }

   
  formatDate(isoDate: string): string {

    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  

  onOptionSelected(event: any) {
    this.university.University = event.option.value;
    this.updateDatabase();
  }
  updateDatabase() {
    // Your code to update the database goes here
    console.log('Updating database with:', this.university.University);
  }


  onSubmit(): void {
    console.log('Form data:', this.university);  // Debug log to check form data

  
    if ( !this.university.Country ||
      !this.university.University ||
      !this.university.City ||
      !this.university.CourseName ||
      !this.university.CourseDescription ||
      !this.university.StartDate ||
      !this.university.EndDate ||
      this.university.Price == null ||
      !this.university.Currency) {
      alert('All fields are required. Please fill in all fields.');
      return;
    }

    // Ensure StartDate and EndDate are formatted correctly before submitting
    if (this.university.StartDate) {
      this.university.StartDate = this.formatDate(this.university.StartDate);
    }
    if (this.university.EndDate) {
      this.university.EndDate = this.formatDate(this.university.EndDate);
    }

    console.log('Formatted data:', this.university);  // Debug log to check formatted data

    this.http.post<any>(' https://backend-1-pyuh.onrender.com/university/', this.university)
      .pipe(
        catchError(error => {
          console.error('HTTP error', error);  // Debug log for HTTP error
          alert('Submission failed. Please check your data or try again later.');
          return of(null); // Return an observable to allow the stream to continue
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Server response:', response);  // Debug log for server response
          alert(response.message);
          this.router.navigate(['/list']);
        }
      });
  }
}
  

