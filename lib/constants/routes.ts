export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/student',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_REPORTS: '/admin/reports',

  // Security Routes
  SECURITY_DASHBOARD: '/security',
  SECURITY_INCIDENTS: '/security/incidents',
  SECURITY_ANALYTICS: '/security/analytics',

  // Complaint Management Routes
  STAFF_COMPLAINTS: '/admin/complaints',
  STAFF_COMPLAINT_DETAIL: (id: string) => `/admin/complaints/${id}`,

  // Faculty Routes
  FACULTY_ATTENDANCE: '/faculty/attendance',
  FACULTY_REPORTS: '/faculty/reports',
  FACULTY_CORRECTIONS: '/faculty/corrections',

  // Mentor / Counsellor Routes
  COUNSELLOR_DASHBOARD: '/counsellor',
  COUNSELLOR_APPOINTMENTS: '/counsellor/appointments',

  // Event Organiser Routes
  ORGANISER_EVENTS: '/organiser/events',
  ORGANISER_EVENT_DETAIL: (id: string) => `/organiser/events/${id}`,
  ORGANISER_SCANNER: '/organiser/scanner',

  // Library Staff Routes
  LIBRARY_STAFF_DASHBOARD: '/library-staff',
  LIBRARY_STAFF_ISSUE_RETURN: '/library-staff/issue-return',
  LIBRARY_STAFF_FINES: '/library-staff/fines',

  // Blood Bank Admin Routes
  BLOOD_ADMIN_DASHBOARD: '/blood-admin',
  BLOOD_ADMIN_REQUESTS: '/blood-admin/requests',
  BLOOD_ADMIN_CAMPAIGNS: '/blood-admin/campaigns',

  // Startup Admin Routes
  STARTUP_ADMIN_DASHBOARD: '/startup-admin',
  STARTUP_ADMIN_REVIEWS: '/startup-admin/reviews',
  STARTUP_ADMIN_INVESTMENTS: '/startup-admin/investments',
} as const;
