export const API_RESOURCES = {
  AUTHENTICATION: 'auth',
  USERS: 'users',
};

export const DEFAULT_API_PATHS = {
  BY_ID: ':id',
};

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    BASE_PATH: `/${API_RESOURCES.AUTHENTICATION}`,
    LOG_IN: 'log-in',
    LOGGED: 'logged'
  },
};
