import api from '../api'

export const feedbackService = {
  getAll: (params) => api.get('/feedback', { params }),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  remove: (id) => api.delete(`/feedback/${id}`),
  search: (params) => api.get('/search', { params }),
  getDashboard: () => api.get('/dashboard/stats'),
}
