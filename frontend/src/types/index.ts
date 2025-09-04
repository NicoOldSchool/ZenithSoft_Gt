export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'Administrador' | 'Recepcionista' | 'Profesional' | 'Solo lectura';
  establecimiento_id: string;
  establecimiento_nombre?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Establecimiento {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Paciente {
  id: string;
  dni: string;
  apellido: string;
  nombre: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  establecimiento_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profesional {
  id: string;
  apellido: string;
  nombre: string;
  telefono?: string;
  email?: string;
  especialidad: string;
  disponibilidad?: Record<string, { inicio: string; fin: string }>;
  activo: boolean;
  establecimiento_id: string;
  created_at: string;
  updated_at: string;
}

export interface Turno {
  id: string;
  paciente_id: string;
  profesional_id: string;
  especialidad: string;
  fecha_hora: string;
  estado: 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Completado' | 'No asistió';
  observaciones?: string;
  establecimiento_id: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales para joins
  paciente_apellido?: string;
  paciente_nombre?: string;
  paciente_telefono?: string;
  paciente_email?: string;
  profesional_apellido?: string;
  profesional_nombre?: string;
  profesional_especialidad?: string;
  profesional_telefono?: string;
}

export interface Arancel {
  id: string;
  codigo: string;
  nombre: string;
  categoria?: string;
  valor: number;
  activo: boolean;
  establecimiento_id: string;
  created_at: string;
  updated_at: string;
}

export interface Practica {
  id: string;
  codigo: string;
  nombre: string;
  categoria?: string;
  turno_id: string;
  establecimiento_id: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales para joins
  turno_fecha_hora?: string;
  turno_estado?: string;
  turno_observaciones?: string;
  paciente_apellido?: string;
  paciente_nombre?: string;
  profesional_apellido?: string;
  profesional_nombre?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  [key: string]: T[];
  pagination: Pagination;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: User['rol'];
  establecimiento_id: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TurnoFilters extends Filters {
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  profesional_id?: string;
}

export interface PacienteFilters extends Filters {
  // Filtros específicos para pacientes
}

export interface ProfesionalFilters extends Filters {
  especialidad?: string;
  activo?: string;
}

export interface ArancelFilters extends Filters {
  categoria?: string;
  activo?: string;
}

export interface PracticaFilters extends Filters {
  categoria?: string;
  turno_id?: string;
}
