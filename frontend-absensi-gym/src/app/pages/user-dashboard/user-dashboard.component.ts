import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.services';
import Swal from 'sweetalert2';
import { TipsCarouselComponent } from './tips-carousel/tips-carousel.component';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartDataset, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
Chart.register(...registerables);


@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    FormsModule, 
    TipsCarouselComponent,
    RouterModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class DashboardUserComponent implements OnInit {
  name = localStorage.getItem('name') || '';
  trainingTypes: any[] = [];
  selectedTrainingType: number | null = null;
  notes: string = '';
  attendances: any[] = [];
  attendanceId: number | null = null;
  message = '';
  error = '';
  selectedExercises: boolean[] = [];
  exerciseDurations: number[] = [];

  lineChart!: Chart | null;
  donutChart!: Chart | null;


  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
  // Pastikan attendances sudah ada sebelum membuat chart
  this.fetchMyAttendancesWithChart();
}

fetchMyAttendancesWithChart() {
  this.attendanceService.getMyAttendances().subscribe({
    next: (res: any) => {
      this.attendances = res;
      this.initLineChart();
      this.initDonutChart();
    },
    error: () => this.error = 'Gagal mengambil riwayat absensi',
  });
}

initLineChart() {
  if (!this.lineChartRef) return;
  const ctx = this.lineChartRef.nativeElement.getContext('2d');
  if (!ctx) return;

  const labels = this.attendances.map(a => new Date(a.date).toLocaleDateString());
  const data = this.attendances.map(a => a.total_calories_burned);

  if (this.lineChart) {
    // update data chart existing
    this.lineChart.data.labels = labels;
    this.lineChart.data.datasets[0].data = data;
    this.lineChart.update();
  } else {
    // buat chart baru
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Kalori Terbakar',
          data,
          borderColor: 'rgb(255,99,132)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: true } } }
    });
  }
}

initDonutChart() {
  if (!this.donutChartRef) return;
  const ctx = this.donutChartRef.nativeElement.getContext('2d');
  if (!ctx) return;

  const caloriesByType: {[key: string]: number} = {};
  this.attendances.forEach(a => {
    caloriesByType[a.training_type] = (caloriesByType[a.training_type] || 0) + a.total_calories_burned;
  });

  const labels = Object.keys(caloriesByType);
  const data = Object.values(caloriesByType);

  if (this.donutChart) {
    this.donutChart.data.labels = labels;
    this.donutChart.data.datasets[0].data = data;
    this.donutChart.update();
  } else {
    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Total Kalori',
          data,
          backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
}


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

  fetchMyAttendances() {
    this.attendanceService.getMyAttendances().subscribe({
      next: (res: any) => this.attendances = res,
      error: () => this.error = 'Gagal mengambil riwayat absensi',
    });
  }

  get selectedTrainingExercise(): any[] {
    const selected = this.trainingTypes?.find(
      (t: any) => t.training_id == this.selectedTrainingType
    );
    return selected?.exercises || [];
  }

    onTrainingTypeChange() {
    this.selectedTrainingExercise.forEach(ex => {
      ex.checked = false;
      ex.duration_minutes = null;
    });
}

    resetExercises() {
    this.selectedExercises.fill(false);
    this.exerciseDurations.fill(0);
  }

    submitAttendance() {
    if (!this.selectedTrainingType) {
      this.error = 'Pilih jenis latihan';
      return;
    }

    // Siapkan array of object sesuai service
      const chosenExercises = this.selectedTrainingExercise
        .filter(ex => ex.checked)
        .map(ex => ({
          exercise_id: ex.id,
          duration_minutes: ex.duration_minutes
        }));

      if (chosenExercises.length === 0) {
        this.error = 'Pilih minimal satu latihan';
        return;
      }

    if (this.attendanceId) {
      // Update attendance
      this.attendanceService
        .editMyAttendances(this.attendanceId, {
          training_type_id: this.selectedTrainingType,
          notes: this.notes || '',
          exercises: chosenExercises
        })
        .subscribe({
          next: () => {
            this.message = 'Absensi berhasil diupdate!';
            this.error = '';
            this.resetForm();
            this.fetchMyAttendances();
            this.fetchMyAttendancesWithChart();
          },
          error: (err) => {
            this.error = 'Gagal update absensi';
            console.error(err);
          }
        });
    } else {
      // Submit attendance baru
      this.attendanceService
        .submitAttendance(
          this.selectedTrainingType,
          this.notes || '',
          chosenExercises
        )
        .subscribe({
          next: () => {
            this.message = 'Absensi berhasil dikirim!';
            this.resetForm();
            this.fetchMyAttendances();
            this.fetchMyAttendancesWithChart();

            Swal.fire({
              title: 'Berhasil',
              text: 'Absensi berhasil dikirim!',
              icon: 'success',
              confirmButtonText: 'Done'
            });
          },
          error: (err) => {
            this.error = 'Gagal mengirim absensi';
            console.error(err);
          }
        });
    }
  }

editAttendance(att: any) {
  this.attendanceId = att.id;

  // Cari ID training type dari nama
  const matchedType = this.trainingTypes.find(
    t => t.training_name === att.training_type
  );
  this.selectedTrainingType = matchedType ? matchedType.training_id : null;

  // Catatan
  this.notes = att.notes || '';

  // Isi latihan setelah training type ter-load di template
  setTimeout(() => {
    if (att.exercises && this.selectedTrainingExercise.length > 0) {
      this.selectedTrainingExercise.forEach(ex => {
        const matchedEx = att.exercises.find((aEx: any) => aEx.name === ex.name);
        if (matchedEx) {
          ex.checked = true;
          ex.duration_minutes = matchedEx.duration_minutes;
        } else {
          ex.checked = false;
          ex.duration_minutes = null;
        }
      });
    }
  }, 0);

  // Scroll ke form
  setTimeout(() => {
    const element = document.getElementById('editAbsensi');

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


  resetForm() {
    this.attendanceId = null;
    this.selectedTrainingType = null;
    this.notes = '';
    this.selectedExercises = [];
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
}
