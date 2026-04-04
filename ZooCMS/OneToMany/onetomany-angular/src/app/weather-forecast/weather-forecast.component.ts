import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent implements OnInit {
  forecasts: Forecast[] = [];
  loading = false;
  error: string | null = null;

  sortColumn: keyof Forecast | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadForecast();
  }

  loadForecast() {
    this.loading = true;
    this.error = null;
    this.http.get<Forecast[]>('https://localhost:7226/WeatherForecast')
      .subscribe({
        next: data => {
          this.forecasts = data;
          if (this.sortColumn) {
            this.sortTable(this.sortColumn);
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error loading data';
          this.loading = false;
        }
      });
  }

  sortTable(column: keyof Forecast) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.forecasts = [...this.forecasts].sort((a, b) => {
      if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}