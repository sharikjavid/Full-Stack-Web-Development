import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-university-details',
  templateUrl: './university-details.component.html',
  styleUrls: ['./university-details.component.css'],
})
export class universityDetailsComponent implements OnInit {
  university_new = {
    university_id: 0,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.university_new.university_id = id;
    });
    this.getuniversity(this.university_new.university_id);
  }

  getuniversity(id: any) {
    this.http
      .get<any>(` https://backend-1-pyuh.onrender.com/university/america`)
      .subscribe((university) => {
        const arr = Object.values(university);

        console.log(arr);
      });
  }

  deleteuniversity(id: number) {
    this.http
      .delete<any[]>(` https://backend-1-pyuh.onrender.com/university/${id}`)
      .subscribe((data: any) => {
        console.log(data);

        this.goToListComponent(id);
      });
  }

  goToListComponent(id: number) {
    this.router.navigate([`/list`]);
  }

  goToUpdateComponent(id: number) {
    this.router.navigate([`/update/${id}`]);
  }
}
