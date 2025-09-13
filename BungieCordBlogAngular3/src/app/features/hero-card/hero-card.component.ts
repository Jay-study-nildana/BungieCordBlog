import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.css']
})
export class HeroCardComponent implements OnInit, OnDestroy {
  @Input() hero: any;
  @Input() images: any[] = [];
  @Input() imageIndex: number = 0;

  private intervalId: any;

  ngOnInit(): void {
    if (this.images && this.images.length > 1) {
      this.intervalId = setInterval(() => {
        this.nextImage();
      }, 3000); // Change image every 3 seconds
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prevImage() {
    if (this.images.length > 0) {
      this.imageIndex = (this.imageIndex - 1 + this.images.length) % this.images.length;
    }
  }

  nextImage() {
    if (this.images.length > 0) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
    }
  }
}