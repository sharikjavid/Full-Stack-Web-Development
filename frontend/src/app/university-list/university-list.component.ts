import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';

// import { universityService } from '../university.service';

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css'],
})
export class universityListComponent implements OnInit {
  universitys: any[] = [];
  totalItems: number = 10000;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(currentPage: number = 10): void {
    this.getuniversitys(currentPage);
  }

  currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
    BYR: 'Br',
    MNT: '₮',
    IDR: 'Rp',
    PHP: '₱',
    BAM: 'KM',
    DOP: 'RD$',
    BRL: 'R$',
    ARS: 'AR$',
    CLP: 'CLP$',
    COP: 'COL$',
    MXN: 'Mex$',
    PEN: 'S/',
    UYU: '$U',
    VEF: 'Bs F',
    VND: '₫',
    THB: '฿',
    SGD: 'S$',
    MYR: 'RM',
    KRW: '₩',
    HKD: 'HK$',
    ZAR: 'R',
    NGN: '₦',
    EGP: 'E£',
    ILS: '₪',
    SAR: 'SR',
    AED: 'د.إ',
    RUB: '₽',
    TRY: '₺',
    PKR: '₨',
    BDT: '৳',
    LKR: 'Rs',
    NPR: 'रू',
    CZK: 'Kč',
    PLN: 'zł',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    ISK: 'kr',
    DKK: 'kr',
    NOK: 'kr',
    EEK: 'kr',
    LVL: 'Ls',
    LTL: 'Lt',
    RSD: 'дин.',
    UAH: '₴',
    GEL: '₾',
    // Add more currency codes and symbols as needed
  };

  getCurrencySymbol(currencyCode: string): string {
    return this.currencySymbols[currencyCode] || currencyCode;
  }

  getuniversitys(page: number): void {
    const skip = this.currentPage;

    this.http
      .get<{ results: any[]; total: number }>(
        `https://backend-1-pyuh.onrender.com/universitys?query=${this.searchQuery}&skip=${skip}&limit=${this.itemsPerPage}`
      )
      .subscribe(
        (response) => {
          this.universitys = response.results;
        },
        (error) => {
          console.error('Error fetching universities:', error);
        }
      );
  }
  deleteuniversity(id: number) {
    this.http
      .delete<any[]>(` https://backend-1-pyuh.onrender.com/university/${id}`)
      .subscribe((data: any) => {
        console.log(data);
        this.getuniversitys(1);
      });
  }

  searchUniversities(): void {
    this.currentPage = 0;
    this.getuniversitys(this.currentPage);
  }

  goToUpdateComponent(id: number) {
    this.router.navigate([`/update/${id}`]);
  }

  pageChanged(page: number): void {
    this.currentPage = page + 10;
    this.getuniversitys(page);
  }

  prevpageChanged(page: number): void {
    this.currentPage = page - 10;
    this.getuniversitys(page);
  }

  calculateLength(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in time
    const timeDiff = end.getTime() - start.getTime();

    // Calculate the difference in days
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // using Math.floor to get the integer part

    return daysDiff;
  }
}
