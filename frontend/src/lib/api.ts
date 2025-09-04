import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Paciente, 
  Profesional, 
  Turno, 
  Arancel, 
  Practica, 
  Establecimiento,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PaginatedResponse,
  TurnoFilters,
  PacienteFilters,
  ProfesionalFilters,
  ArancelFilters,
  PracticaFilters
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await this.client.get('/auth/me');
    return response.data.user;
  }

  // Users endpoints
  async getUsers(filters?: PacienteFilters): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.client.get('/users', { params: filters });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await this.client.get(`/users/${id}`);
    return response.data.user;
  }

  async createUser(data: Omit<RegisterData, 'establecimiento_id'>): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await this.client.post('/users', data);
    return response.data.user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await this.client.put(`/users/${id}`, data);
    return response.data.user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  // Pacientes endpoints
  async getPacientes(filters?: PacienteFilters): Promise<PaginatedResponse<Paciente>> {
    const response: AxiosResponse<PaginatedResponse<Paciente>> = await this.client.get('/pacientes', { params: filters });
    return response.data;
  }

  async getPaciente(id: string): Promise<Paciente> {
    const response: AxiosResponse<{ paciente: Paciente }> = await this.client.get(`/pacientes/${id}`);
    return response.data.paciente;
  }

  async createPaciente(data: Omit<Paciente, 'id' | 'establecimiento_id' | 'created_at' | 'updated_at'>): Promise<Paciente> {
    const response: AxiosResponse<{ paciente: Paciente }> = await this.client.post('/pacientes', data);
    return response.data.paciente;
  }

  async updatePaciente(id: string, data: Partial<Paciente>): Promise<Paciente> {
    const response: AxiosResponse<{ paciente: Paciente }> = await this.client.put(`/pacientes/${id}`, data);
    return response.data.paciente;
  }

  async deletePaciente(id: string): Promise<void> {
    await this.client.delete(`/pacientes/${id}`);
  }

  // Profesionales endpoints
  async getProfesionales(filters?: ProfesionalFilters): Promise<PaginatedResponse<Profesional>> {
    const response: AxiosResponse<PaginatedResponse<Profesional>> = await this.client.get('/profesionales', { params: filters });
    return response.data;
  }

  async getProfesional(id: string): Promise<Profesional> {
    const response: AxiosResponse<{ profesional: Profesional }> = await this.client.get(`/profesionales/${id}`);
    return response.data.profesional;
  }

  async createProfesional(data: Omit<Profesional, 'id' | 'establecimiento_id' | 'created_at' | 'updated_at'>): Promise<Profesional> {
    const response: AxiosResponse<{ profesional: Profesional }> = await this.client.post('/profesionales', data);
    return response.data.profesional;
  }

  async updateProfesional(id: string, data: Partial<Profesional>): Promise<Profesional> {
    const response: AxiosResponse<{ profesional: Profesional }> = await this.client.put(`/profesionales/${id}`, data);
    return response.data.profesional;
  }

  async deleteProfesional(id: string): Promise<void> {
    await this.client.delete(`/profesionales/${id}`);
  }

  // Turnos endpoints
  async getTurnos(filters?: TurnoFilters): Promise<PaginatedResponse<Turno>> {
    const response: AxiosResponse<PaginatedResponse<Turno>> = await this.client.get('/turnos', { params: filters });
    return response.data;
  }

  async getTurno(id: string): Promise<Turno> {
    const response: AxiosResponse<{ turno: Turno }> = await this.client.get(`/turnos/${id}`);
    return response.data.turno;
  }

  async createTurno(data: Omit<Turno, 'id' | 'establecimiento_id' | 'created_at' | 'updated_at'>): Promise<Turno> {
    const response: AxiosResponse<{ turno: Turno }> = await this.client.post('/turnos', data);
    return response.data.turno;
  }

  async updateTurno(id: string, data: Partial<Turno>): Promise<Turno> {
    const response: AxiosResponse<{ turno: Turno }> = await this.client.put(`/turnos/${id}`, data);
    return response.data.turno;
  }

  async deleteTurno(id: string): Promise<void> {
    await this.client.delete(`/turnos/${id}`);
  }

  // Aranceles endpoints
  async getAranceles(filters?: ArancelFilters): Promise<PaginatedResponse<Arancel>> {
    const response: AxiosResponse<PaginatedResponse<Arancel>> = await this.client.get('/aranceles', { params: filters });
    return response.data;
  }

  async getArancel(id: string): Promise<Arancel> {
    const response: AxiosResponse<{ arancel: Arancel }> = await this.client.get(`/aranceles/${id}`);
    return response.data.arancel;
  }

  async createArancel(data: Omit<Arancel, 'id' | 'establecimiento_id' | 'created_at' | 'updated_at'>): Promise<Arancel> {
    const response: AxiosResponse<{ arancel: Arancel }> = await this.client.post('/aranceles', data);
    return response.data.arancel;
  }

  async updateArancel(id: string, data: Partial<Arancel>): Promise<Arancel> {
    const response: AxiosResponse<{ arancel: Arancel }> = await this.client.put(`/aranceles/${id}`, data);
    return response.data.arancel;
  }

  async deleteArancel(id: string): Promise<void> {
    await this.client.delete(`/aranceles/${id}`);
  }

  // Practicas endpoints
  async getPracticas(filters?: PracticaFilters): Promise<PaginatedResponse<Practica>> {
    const response: AxiosResponse<PaginatedResponse<Practica>> = await this.client.get('/practicas', { params: filters });
    return response.data;
  }

  async getPractica(id: string): Promise<Practica> {
    const response: AxiosResponse<{ practica: Practica }> = await this.client.get(`/practicas/${id}`);
    return response.data.practica;
  }

  async createPractica(data: Omit<Practica, 'id' | 'establecimiento_id' | 'created_at' | 'updated_at'>): Promise<Practica> {
    const response: AxiosResponse<{ practica: Practica }> = await this.client.post('/practicas', data);
    return response.data.practica;
  }

  async updatePractica(id: string, data: Partial<Practica>): Promise<Practica> {
    const response: AxiosResponse<{ practica: Practica }> = await this.client.put(`/practicas/${id}`, data);
    return response.data.practica;
  }

  async deletePractica(id: string): Promise<void> {
    await this.client.delete(`/practicas/${id}`);
  }

  // Establecimientos endpoints
  async getEstablecimientos(filters?: any): Promise<PaginatedResponse<Establecimiento>> {
    const response: AxiosResponse<PaginatedResponse<Establecimiento>> = await this.client.get('/establecimientos', { params: filters });
    return response.data;
  }

  async getEstablecimiento(id: string): Promise<Establecimiento> {
    const response: AxiosResponse<{ establecimiento: Establecimiento }> = await this.client.get(`/establecimientos/${id}`);
    return response.data.establecimiento;
  }

  async createEstablecimiento(data: Omit<Establecimiento, 'id' | 'created_at' | 'updated_at'>): Promise<Establecimiento> {
    const response: AxiosResponse<{ establecimiento: Establecimiento }> = await this.client.post('/establecimientos', data);
    return response.data.establecimiento;
  }

  async updateEstablecimiento(id: string, data: Partial<Establecimiento>): Promise<Establecimiento> {
    const response: AxiosResponse<{ establecimiento: Establecimiento }> = await this.client.put(`/establecimientos/${id}`, data);
    return response.data.establecimiento;
  }

  async deleteEstablecimiento(id: string): Promise<void> {
    await this.client.delete(`/establecimientos/${id}`);
  }
}

export const api = new ApiClient();
