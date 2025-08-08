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
  attendanceId: number | null = null;
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
    if (!this.selectedTrainingType) {
      this.error = 'Pilih jenis latihan';
      return;
    };
    
    const payload: any = {
      training_type_id: this.selectedTrainingType,
      notes: this.notes || ''
    }

    if (this.attendanceId) {
      this.attendanceService.editMyAttendances(this.attendanceId, payload).subscribe({
        next: () => {
          this.message = 'Absensi berhasil diupdate!';
          this.error = '';
          this.resetForm();
          this.fetchMyAttendances();
        },
        error: (err) => {
          this.error = 'Gagal ambil absensi';
          console.error(err);
        }
      });
    } else {
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
  }

  editAttendance(att: any) {
    this.attendanceId = att.id;
    this.selectedTrainingType = att.training_type_id;
    this.notes = att.notes;
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }

  resetForm() {
    this.attendanceId = null;
    this.selectedTrainingType = '';
    this.notes = '';
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

  get selectedTrainingDescription(): string {
  const selected = this.trainingTypes?.find(t => t.id == this.selectedTrainingType);
  return selected?.description || 'Tidak ada deskripsi';
}

}
