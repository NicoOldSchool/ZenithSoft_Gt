export interface Database {
  public: {
    Tables: {
      establecimientos: {
        Row: {
          id: string
          nombre: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          nombre: string | null
          email: string
          rol: 'admin' | 'recepcionista' | 'profesional' | 'lectura'
          establecimiento_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre?: string | null
          email: string
          rol: 'admin' | 'recepcionista' | 'profesional' | 'lectura'
          establecimiento_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          email?: string
          rol?: 'admin' | 'recepcionista' | 'profesional' | 'lectura'
          establecimiento_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pacientes: {
        Row: {
          id: string
          dni: string
          apellido: string
          nombre: string
          telefono: string | null
          email: string | null
          establecimiento_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dni: string
          apellido: string
          nombre: string
          telefono?: string | null
          email?: string | null
          establecimiento_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dni?: string
          apellido?: string
          nombre?: string
          telefono?: string | null
          email?: string | null
          establecimiento_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profesionales: {
        Row: {
          id: string
          apellido: string
          nombre: string
          telefono: string | null
          email: string | null
          especialidad: string
          disponibilidad: any | null
          activo: boolean
          establecimiento_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          apellido: string
          nombre: string
          telefono?: string | null
          email?: string | null
          especialidad: string
          disponibilidad?: any | null
          activo?: boolean
          establecimiento_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          apellido?: string
          nombre?: string
          telefono?: string | null
          email?: string | null
          especialidad?: string
          disponibilidad?: any | null
          activo?: boolean
          establecimiento_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      turnos: {
        Row: {
          id: string
          paciente_id: string | null
          profesional_id: string | null
          especialidad: string | null
          fecha_hora: string
          estado: 'programado' | 'completado' | 'cancelado' | 'ausente'
          observaciones: string | null
          establecimiento_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          paciente_id?: string | null
          profesional_id?: string | null
          especialidad?: string | null
          fecha_hora: string
          estado?: 'programado' | 'completado' | 'cancelado' | 'ausente'
          observaciones?: string | null
          establecimiento_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          paciente_id?: string | null
          profesional_id?: string | null
          especialidad?: string | null
          fecha_hora?: string
          estado?: 'programado' | 'completado' | 'cancelado' | 'ausente'
          observaciones?: string | null
          establecimiento_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      aranceles: {
        Row: {
          id: string
          codigo: string
          nombre: string
          categoria: string | null
          valor: number | null
          activo: boolean
          establecimiento_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          categoria?: string | null
          valor?: number | null
          activo?: boolean
          establecimiento_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          categoria?: string | null
          valor?: number | null
          activo?: boolean
          establecimiento_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      practicas: {
        Row: {
          id: string
          codigo: string
          nombre: string
          categoria: string | null
          turno_id: string
          establecimiento_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          categoria?: string | null
          turno_id: string
          establecimiento_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          categoria?: string | null
          turno_id?: string
          establecimiento_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos derivados para uso en la aplicación
export type Establecimiento = Database['public']['Tables']['establecimientos']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Paciente = Database['public']['Tables']['pacientes']['Row']
export type Profesional = Database['public']['Tables']['profesionales']['Row']
export type Turno = Database['public']['Tables']['turnos']['Row']
export type Arancel = Database['public']['Tables']['aranceles']['Row']
export type Practica = Database['public']['Tables']['practicas']['Row']

// Tipos para inserción
export type EstablecimientoInsert = Database['public']['Tables']['establecimientos']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type PacienteInsert = Database['public']['Tables']['pacientes']['Insert']
export type ProfesionalInsert = Database['public']['Tables']['profesionales']['Insert']
export type TurnoInsert = Database['public']['Tables']['turnos']['Insert']
export type ArancelInsert = Database['public']['Tables']['aranceles']['Insert']
export type PracticaInsert = Database['public']['Tables']['practicas']['Insert']

// Tipos para actualización
export type EstablecimientoUpdate = Database['public']['Tables']['establecimientos']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type PacienteUpdate = Database['public']['Tables']['pacientes']['Update']
export type ProfesionalUpdate = Database['public']['Tables']['profesionales']['Update']
export type TurnoUpdate = Database['public']['Tables']['turnos']['Update']
export type ArancelUpdate = Database['public']['Tables']['aranceles']['Update']
export type PracticaUpdate = Database['public']['Tables']['practicas']['Update']
