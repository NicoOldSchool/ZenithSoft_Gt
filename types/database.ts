export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      establecimientos: {
        Row: {
          created_at: string
          id: string
          nombre: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establecimientos_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      miembros_establecimiento: {
        Row: {
          created_at: string
          establecimiento_id: string
          id: number
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          establecimiento_id: string
          id?: number
          role?: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          establecimiento_id?: string
          id?: number
          role?: Database["public"]["Enums"]["member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miembros_establecimiento_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_establecimiento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          activo: boolean
          categoria: string | null
          codigo: string
          created_at: string
          establecimiento_id: string | null
          id: string
          nombre: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          activo?: boolean
          categoria?: string | null
          codigo: string
          created_at?: string
          establecimiento_id?: string | null
          id?: string
          nombre: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          activo?: boolean
          categoria?: string | null
          codigo?: string
          created_at?: string
          establecimiento_id?: string | null
          id?: string
          nombre?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aranceles_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id"]
          },
        ]
      }
      practicas: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string
          establecimiento_id: string | null
          id: string
          nombre: string
          turno_id: string | null
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string
          establecimiento_id?: string | null
          id?: string
          nombre: string
          turno_id?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string
          establecimiento_id?: string | null
          id?: string
          nombre?: string
          turno_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicas_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practicas_turno_id_fkey"
            columns: ["turno_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          establecimiento_id: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          establecimiento_id?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          establecimiento_id?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_establishment_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      member_role: "admin" | "member"
      user_role: "admin" | "member"
    }
    CompositeTypes: {
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
