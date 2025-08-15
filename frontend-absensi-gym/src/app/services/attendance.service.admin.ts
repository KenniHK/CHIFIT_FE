import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AttendanceServiceAdmin {
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

    getAllAttendances() {
        return this.http.get(`${this.apiUrl}/absensi`, this.getAuthHeaders());
    }

    updateAttendanceStatus(id: number, status: string) {
        return this.http.put(`${this.apiUrl}/absensi/${id}`, { status }, this.getAuthHeaders());
    }

    commentAttendanceNote(data : { id: number, comment: string }) {
     return this.http.put(`${this.apiUrl}/absensi/${data.id}/response`, { admin_response: data.comment }, this.getAuthHeaders());
    }

    getTrainingTypes() {
    return this.http.get(`${this.apiUrl}/latihan`, this.getAuthHeaders());
    }

    createTraining(data: { name: string, description: string, exercises: { name: string, met_value: number}[] }) {
    return this.http.post(`${this.apiUrl}/latihan`, data, this.getAuthHeaders());
    }

    updateTraining(data: { id: number, name: string, description: string }) {
    return this.http.put(`${this.apiUrl}/latihan/${data.id}`, data, this.getAuthHeaders());
    }

    deleteTraining(id: number) {
    return this.http.delete(`${this.apiUrl}/latihan/${id}`, this.getAuthHeaders());
    }

    deleteAttendance(id: number) {
    return this.http.delete(`${this.apiUrl}/absensi/${id}`, this.getAuthHeaders());
    }
}
