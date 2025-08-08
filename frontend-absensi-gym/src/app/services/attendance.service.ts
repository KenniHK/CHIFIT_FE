import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Service User

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = 'https://chifitbend-production.up.railway.app/api';

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

  editMyAttendances(id: number, data: {training_type_id: number, notes: string}): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/absensi/editAttendance/${id}`, data, this.getAuthHeaders());
  }
}
