import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

@Component({
  selector: 'app-tips-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tips-carousel.component.html',
  styleUrls: ['./tips-carousel.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TipsCarouselComponent {

  flippedCard: any = null;

  flipCard(card: any) {
    if (this.flippedCard === card) {
      this.flippedCard = null;
    } else {
      this.flippedCard = card;
    }
  }
  tips = [
    {
      img: 'assets/ProgresiveOverload.png',
      alt: 'overload',
      title: 'Progresive Overload',
      text: 'Naikkan beban perlahan setiap 1-2 minggu.'
    },
    {
      img: 'assets/cardio.png',
      alt: 'cardio',
      title: 'Kardio setelah latihan beban',
      text: 'Membakar lemak secara maksimal'
    },
    {
      img: 'assets/defisit.png',
      alt: 'defisit',
      title: 'Pola makan defisit kalori',
      text: 'Kurangi kalori tapi tetap tinggi protein.'
    }
  ];

ngOnInit() {
  new Swiper('.mySwiper', {
    slidesPerView: 'auto',
    centeredSlides: true, 
    spaceBetween: 15, 
    initialSlide: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
  });
}
}
