import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceServiceAdmin } from '../../services/attendance.service.admin';
import { AuthService } from '../../services/auth.services';
import 'datatables.net';

declare var $: any;


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class DashboardAdminComponent implements OnInit {  
  newTraining = {
    name: '',
    description: '',
    exercises: [
      { name: '', met_value: 0 }
    ]
  };
  trainingTypes: any[] = [];
  name = localStorage.getItem('name') || '';
  editingTraining: any = null;

  attendances: any[] = [];
  dtInitialized = false;
  commentingId: number | null = null;
  selectedAttendanceId: number | null = null;
  commentText: string = '';
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
      next: (res: any) => {
        this.attendances = res;

        // Delay sedikit supaya Angular render dulu
        setTimeout(() => {
          if (this.dtInitialized) {
            // destroy dulu kalau sudah pernah di-init
            $('#attendanceTable').DataTable().clear().destroy();
          }
          this.initDataTable();
          this.dtInitialized = true;
        }, 200);
      },
      error: () => this.error = 'Gagal mengambil data absensi',
    });
  }

  initDataTable() {
    ($('#attendanceTable') as any).DataTable({
      paging: true,
      searching: true,
      ordering: true,
      pageLength: 5,
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
        paginate: {
          previous: "‹",
          next: "›"
        }
      }
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

  addExercise() {
    this.newTraining.exercises.push({ name: '', met_value: 0 });
  };

  removeExercise(index: number) {
    this.newTraining.exercises.splice(index, 1);
  }

  createTraining() {
    this.attendanceServiceAdmin.createTraining(this.newTraining).subscribe({
      next: () => {
        this.message = 'Jenis latihan berhasil ditambahkan';
        this.fetchTrainingTypes();
        this.newTraining = { name: '', description: '', exercises: [{ name: '', met_value: 0 }] };
      },
      error: () => this.error = 'Gagal menambahkan jenis latihan',
    });
  }

  startEdit(training: any) {
    this.editingTraining = JSON.parse(JSON.stringify(training));

    
    setTimeout(() => {
    const element = document.getElementById('editLatihan');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      console.warn(`Element not found.`);
    }
  }, 0);
  }

  updateTraining() {
    const payload = {
      name: this.editingTraining.training_name,
      description: this.editingTraining.description,
      exercises: this.editingTraining.exercises?.map((ex: any) => ({
        name: ex.name,
        met_value: Number(ex.met_value)
      }))
    };

    console.log('Payload Final: ', payload);
    console.log('ID yang dipakai:', this.editingTraining.training_id);

    this.attendanceServiceAdmin.updateTraining(
      this.editingTraining.training_id,
      payload
    ).subscribe({
      next: () => {
        this.message = 'Jenis latihan berhasil di update';
        this.editingTraining = null;
        this.fetchTrainingTypes();
      },
      error: (err) => {
        console.error('Error update training:', err);
        this.error = 'Gagal mengupdate jenis latihan';
      },
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
        this.fetchAllAttendances();
      },
      error: (err) => {
        this.error = 'Gagal menghapus absensi';
        console.error(err);
      }
    });
  }
}

  openCommentModal(id: number) {
  this.selectedAttendanceId = id;
  this.commentText = '';
  const modalEl = document.getElementById('commentModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

submitComment() {
    if (!this.commentText.trim() || !this.selectedAttendanceId) return;

    this.attendanceServiceAdmin.commentAttendanceNote({
      id: this.selectedAttendanceId,
      comment: this.commentText
    })
    .subscribe({
      next: () => {
        this.fetchAllAttendances();
        this.selectedAttendanceId = null;
        this.commentText = '';

        const modalEl = document.getElementById('commentModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => {
        console.error('Gagal mengirim komentar', err);
      }
    });
  }
}
