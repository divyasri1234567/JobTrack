const API_URLS = {
  applications: {
    list: "/applications/",
    detail: (id) => `/applications/${id}/`,
  },

  dashboard: "/dashboard/",

  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    refresh: "/auth/refresh/",
  },
};

export default API_URLS;