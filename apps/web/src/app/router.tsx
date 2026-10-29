import { createBrowserRouter } from 'react-router';

import { LandingPage } from '../features/landing/LandingPage';

/**
 * Route map. Each feature owns its routes: add one line per feature here.
 *   /                public landing page
 *   /recruiter/*     recruiter SaaS (desktop)
 *   /simulation/*    candidate Job Simulation runtime (opened from the mobile app)
 */
export const router = createBrowserRouter([{ path: '/', element: <LandingPage /> }]);
