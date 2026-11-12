import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/portfolio-switcher/portfolio-switcher.component').then(
        (m) => m.PortfolioSwitcherComponent,
      ),
    children: [
      {
        path: 'community/hackathons/:slug',
        loadComponent: () =>
          import('./components/sections/community/hackathon-detail/hackathon-detail.component').then(
            (m) => m.HackathonDetailComponent,
          ),
      },
      {
        path: 'community/videos/:slug',
        loadComponent: () =>
          import('./components/sections/community/video-detail/video-detail.component').then(
            (m) => m.VideoDetailComponent,
          ),
      },
      {
        path: 'community/solutions/:slug',
        loadComponent: () =>
          import('./components/sections/community/solution-detail/solution-detail.component').then(
            (m) => m.SolutionDetailComponent,
          ),
      },
      {
        path: 'community/events/:slug',
        loadComponent: () =>
          import('./components/sections/community/event-detail/event-detail.component').then(
            (m) => m.EventDetailComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
