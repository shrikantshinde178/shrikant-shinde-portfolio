import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-modal.html',
  styleUrl: './video-modal.scss',
})
export class VideoModal {
  videoLoaded = false;

  constructor(private router: Router) {}

  onVideoLoad() {
    this.videoLoaded = true;
  }

  closeVideo() {
    this.router.navigate(['/']);
  }
}
