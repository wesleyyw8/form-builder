import axios from 'axios';
import { Form } from '../types';

const API_URL = 'http://localhost:8080/api';

export const api = {
  getForms: async (): Promise<Form[]> => {
    const response = await axios.get(`${API_URL}/forms`);
    return response.data;
  },

  createForm: async (form: Form): Promise<Form> => {
    const response = await axios.post(`${API_URL}/forms`, form);
    return response.data;
  },

  updateForm: async (id: number, form: Form): Promise<Form> => {
    const response = await axios.put(`${API_URL}/forms/${id}`, form);
    return response.data;
  },

  deleteForm: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/forms/${id}`);
  }
}; 