import { Routes } from '@angular/router';
import { VideoModal } from './components/video-modal/video-modal';
import { App } from './app';

export const routes: Routes = [
  {
    path: 'intro',
    loadComponent: () =>
      import('./components/video-modal/video-modal').then((m) => m.VideoModal),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
