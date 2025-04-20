import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }),

  register: (userData) => api.post("/auth/register", userData),

  getCurrentUser: () => api.get("/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

// Employee API
export const employeeAPI = {
  getAllEmployees: () => api.get("/employees"),

  getEmployeeById: (id) => api.get(`/employees/${id}`),

  createEmployee: (employeeData) => api.post("/employees", employeeData),

  updateEmployee: (id, employeeData) =>
    api.put(`/employees/${id}`, employeeData),

  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAllAttendance: (filters = {}) =>
    api.get("/attendance", { params: filters }),

  getEmployeeAttendance: (employeeId, filters = {}) =>
    api.get(`/attendance/employee/${employeeId}`, { params: filters }),

  createAttendance: (attendanceData) => api.post("/attendance", attendanceData),

  updateAttendance: (id, attendanceData) =>
    api.put(`/attendance/${id}`, attendanceData),

  getDailyReport: (date) =>
    api.get("/attendance/reports/daily", { params: { date } }),
};

// Face Recognition API
export const faceAPI = {
  registerFace: (employeeId, faceData) =>
    api.post(`/face/register/${employeeId}`, { faceData }),

  recognizeFace: (faceData) => api.post("/face/recognize", { faceData }),
};

// Settings API
export const settingsAPI = {
  getAllSettings: (category) => api.get("/settings", { params: { category } }),

  updateSetting: (name, value) => api.put(`/settings/${name}`, { value }),

  initializeSettings: () => api.post("/settings/initialize"),
};

export default api;
