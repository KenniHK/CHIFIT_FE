import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
})
export class DashboardUserComponent implements OnInit {
  name = localStorage.getItem('name') || '';
  trainingTypes: any[] = [];
  selectedTrainingType: string = '';
  notes: string = '';
  attendances: any[] = [];
  message = '';
  error = '';

  constructor(
    private attendanceService: AttendanceService, 
    private authService: AuthService) {}

  ngOnInit() {
    this.fetchTrainingTypes();
    this.fetchMyAttendances();
  }

  fetchTrainingTypes() {
    this.attendanceService.getTrainingTypes().subscribe({
      next: (res: any) => this.trainingTypes = res,
      error: (err) => this.error = 'Gagal mengambil jenis latihan',
    });
  }

  submitAttendance() {
    if (!this.selectedTrainingType) return;

    this.attendanceService.submitAttendance(Number(this.selectedTrainingType), this.notes).subscribe({
      next: () => {
        this.message = 'Absensi berhasil dikirim!';
        this.notes = '';
        this.selectedTrainingType = '';
        this.fetchMyAttendances();

        Swal.fire({
          title: 'Berhasil',
          text: 'Absensi berhasil dikirim!',
          icon: 'success',
          confirmButtonText: 'Done'
        })
      },
      error: () => {
        this.error = 'Gagal mengirim absensi';
      },
    });
  }

  LogOut() {
    Swal.fire({
      title: "Keluar dari aplikasi?",
      text: "Anda akan keluar dari aplikasi",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Keluar"
    }).then((result) => {
      if (result.isConfirmed) {
      this.authService.logout()
        Swal.fire({
          title: "Log Out",
          text: "Anda telah keluar dari aplikasi",
          icon: "success"
        });
      }
    });
  }

  fetchMyAttendances() {
    this.attendanceService.getMyAttendances().subscribe({
      next: (res: any) => this.attendances = res,
      error: () => this.error = 'Gagal mengambil riwayat absensi',
    });
  }
}
