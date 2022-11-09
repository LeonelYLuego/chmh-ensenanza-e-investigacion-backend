/** @Constant Resources API Endpoints */
export const API_RESOURCES = {
  AUTHENTICATION: 'auth',
  USERS: 'users',
  SPECIALTIES: 'specialties',
  STUDENTS: 'students',
  HOSPITALS: 'hospitals',
  SOCIAL_SERVICES: 'social-services',
  TEMPLATES: 'templates',
  ROTATION_SERVICES: 'rotation-services',
};

/** @Constant Default API Paths Endpoints */
export const DEFAULT_API_PATHS = {
  BY_ID: '_id',
};

/** @Constants API Endpoints */
export const API_ENDPOINTS = {
  AUTHENTICATION: {
    BASE_PATH: `/${API_RESOURCES.AUTHENTICATION}`,
    LOG_IN: 'log-in',
    LOGGED: 'logged',
  },
  USERS: {
    BASE_PATH: API_RESOURCES.USERS,
    BY_ID: DEFAULT_API_PATHS.BY_ID,
  },
  SPECIALTIES: {
    BASE_PATH: API_RESOURCES.SPECIALTIES,
    BY_ID: DEFAULT_API_PATHS.BY_ID,
  },
  STUDENTS: {
    BASE_PATH: API_RESOURCES.STUDENTS,
    BY_ID: DEFAULT_API_PATHS.BY_ID,
  },
  HOSPITALS: {
    BASE_PATH: API_RESOURCES.HOSPITALS,
    BY_ID: DEFAULT_API_PATHS.BY_ID,
    SOCIAL_SERVICE: '/social-service',
  },
  SOCIAL_SERVICES: {
    BASE_PATH: API_RESOURCES.SOCIAL_SERVICES,
    BY_ID: DEFAULT_API_PATHS.BY_ID,
    PERIODS: '/periods',
    GENERATE: '/generate',
    DOCUMENT: `/document/:${DEFAULT_API_PATHS.BY_ID}`,
  },
  TEMPLATES: {
    BASE_PATH: API_RESOURCES.TEMPLATES,
    BY_DOCUMENT: 'document',
  },
  ROTATION_SERVICES: {
    BASE_PATH: API_RESOURCES.ROTATION_SERVICES,
    BY_ID: DEFAULT_API_PATHS.BY_ID
  },
};
