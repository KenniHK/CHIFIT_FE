import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceServiceAdmin } from '../../services/attendance.service.admin';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class DashboardAdminComponent implements OnInit {
  trainingTypes: any[] = [];
  name = localStorage.getItem('name') || '';
  newTraining = { name: '', description: '' };
  editingTraining: any = null;

  attendances: any[] = [];
  error = '';
  message = '';

  constructor(
    private attendanceServiceAdmin: AttendanceServiceAdmin,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchAllAttendances();
    this.fetchTrainingTypes();
  }

  fetchAllAttendances() {
    this.attendanceServiceAdmin.getAllAttendances().subscribe({
      next: (res: any) => this.attendances = res,
      error: () => this.error = 'Gagal mengambil data absensi',
    });
  }

  updateStatus(id: number, status: string) {
    this.attendanceServiceAdmin.updateAttendanceStatus(id, status).subscribe({
      next: () => {
        this.message = `Absensi #${id} berhasil di-${status}`;
        this.fetchAllAttendances();
      },
      error: () => this.error = `Gagal mengupdate status absensi #${id}`,
    });
  }

  
  fetchTrainingTypes() {
    this.attendanceServiceAdmin.getTrainingTypes().subscribe({
      next: (res: any) => this.trainingTypes = res,
      error: () => this.error = 'Gagal mengambil data latihan',
    });
  }

  createTraining() {
    this.attendanceServiceAdmin.createTraining(this.newTraining).subscribe({
      next: () => {
        this.message = 'Jenis latihan berhasil ditambahkan';
        this.newTraining = { name: '', description: '' };
        this.fetchTrainingTypes();
      },
      error: () => this.error = 'Gagal menambahkan jenis latihan',
    });
  }

  startEdit(training: any) {
    this.editingTraining = { ...training };
  }

  updateTraining() {
    this.attendanceServiceAdmin.updateTraining(this.editingTraining).subscribe({
      next: () => {
        this.message = 'Jenis latihan berhasil diupdate';
        this.editingTraining = null;
        this.fetchTrainingTypes();
      },
      error: () => this.error = 'Gagal mengupdate jenis latihan',
    });
  }

  deleteTraining(id: number) {
    if (!confirm('Yakin ingin menghapus jenis latihan ini?')) return;

    this.attendanceServiceAdmin.deleteTraining(id).subscribe({
      next: () => {
        this.message = 'Jenis latihan dihapus';
        this.fetchTrainingTypes();
      },
      error: () => this.error = 'Gagal menghapus jenis latihan',
    });
  }

  cancelEdit() {
    this.editingTraining = null;
  }

  LogOut() {
    this.authService.logout()
  }

  deleteAttendance(id: number) {
  if (confirm('Yakin ingin menghapus absensi ini?')) {
    this.attendanceServiceAdmin.deleteAttendance(id).subscribe({
      next: () => {
        this.message = 'Absensi berhasil dihapus';
        this.fetchAllAttendances(); // Reload data absensi
      },
      error: (err) => {
        this.error = 'Gagal menghapus absensi';
        console.error(err);
      }
    });
  }
  }
}
