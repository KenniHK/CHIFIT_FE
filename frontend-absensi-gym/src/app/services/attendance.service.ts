import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getTrainingTypes() {
    return this.http.get(`${this.apiUrl}/latihan`, this.getAuthHeaders());
  }

  submitAttendance(training_type_id: number, notes: string) {
    return this.http.post(`${this.apiUrl}/absensi`, { training_type_id, notes }, this.getAuthHeaders());
  }

  getMyAttendances() {
    return this.http.get(`${this.apiUrl}/absensi/mine`, this.getAuthHeaders());
  }
}
