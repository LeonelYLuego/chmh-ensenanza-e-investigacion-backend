/** @Constant Resources API Endpoints */
export const API_RESOURCES = {
  AUTHENTICATION: 'auth',
  USERS: 'users',
  SPECIALTIES: 'specialties',
  STUDENTS: 'students',
  HOSPITALS: 'hospitals',
  SOCIAL_SERVICES: 'social-services',
};

/** @Constant Default API Paths Endpoints */
export const DEFAULT_API_PATHS = {
  BY_ID: ':_id',
};

/** @Constants API Endpoints */
export const API_ENDPOINTS = {
  AUTHENTICATION: {
    BASE_PATH: `/${API_RESOURCES.AUTHENTICATION}`,
    LOG_IN: 'log-in',
    LOGGED: 'logged',
  },
  HOSPITALS: {
    PRESENTATION_OFFICE: `/presentation-office/${DEFAULT_API_PATHS.BY_ID}`,
    REPORT: `/report/${DEFAULT_API_PATHS.BY_ID}`,
    COSTANCY: `/constancy/${DEFAULT_API_PATHS.BY_ID}`,
  }
};
