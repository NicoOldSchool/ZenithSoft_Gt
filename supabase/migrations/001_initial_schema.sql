-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Establecimientos
CREATE TABLE establecimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios (extendiendo auth.users de Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre TEXT,
  email TEXT UNIQUE NOT NULL,
  rol TEXT CHECK (rol IN ('admin', 'recepcionista', 'profesional', 'lectura')),
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pacientes
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni TEXT NOT NULL,
  apellido TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dni, establecimiento_id)
);

-- Profesionales
CREATE TABLE profesionales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apellido TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  especialidad TEXT NOT NULL,
  disponibilidad JSONB, -- { "dias": ["Lun","Mar"], "horarios": ["08:00-12:00"], "bloque": 30 }
  activo BOOLEAN DEFAULT true,
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turnos
CREATE TABLE turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  profesional_id UUID REFERENCES profesionales(id) ON DELETE SET NULL,
  especialidad TEXT,
  fecha_hora TIMESTAMPTZ NOT NULL,
  estado TEXT CHECK (estado IN ('programado', 'completado', 'cancelado', 'ausente')) DEFAULT 'programado',
  observaciones TEXT,
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aranceles
CREATE TABLE aranceles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  categoria TEXT,
  valor NUMERIC(10,2),
  activo BOOLEAN DEFAULT true,
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(codigo, establecimiento_id)
);

-- Prácticas
CREATE TABLE practicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  categoria TEXT,
  turno_id UUID REFERENCES turnos(id) ON DELETE CASCADE,
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_pacientes_establecimiento ON pacientes(establecimiento_id);
CREATE INDEX idx_pacientes_dni ON pacientes(dni);
CREATE INDEX idx_profesionales_establecimiento ON profesionales(establecimiento_id);
CREATE INDEX idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX idx_turnos_establecimiento ON turnos(establecimiento_id);
CREATE INDEX idx_turnos_fecha_hora ON turnos(fecha_hora);
CREATE INDEX idx_turnos_profesional ON turnos(profesional_id);
CREATE INDEX idx_turnos_paciente ON turnos(paciente_id);
CREATE INDEX idx_aranceles_establecimiento ON aranceles(establecimiento_id);
CREATE INDEX idx_aranceles_codigo ON aranceles(codigo);
CREATE INDEX idx_practicas_establecimiento ON practicas(establecimiento_id);
CREATE INDEX idx_practicas_turno ON practicas(turno_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_establecimientos_updated_at BEFORE UPDATE ON establecimientos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON pacientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profesionales_updated_at BEFORE UPDATE ON profesionales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turnos_updated_at BEFORE UPDATE ON turnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aranceles_updated_at BEFORE UPDATE ON aranceles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practicas_updated_at BEFORE UPDATE ON practicas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aranceles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practicas ENABLE ROW LEVEL SECURITY;

-- Políticas para establecimientos (solo admins pueden gestionar)
CREATE POLICY "Establecimientos solo para admins" ON establecimientos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.rol = 'admin'
    )
  );

-- Políticas para usuarios (solo admins pueden gestionar)
CREATE POLICY "Users solo para admins" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.rol = 'admin'
    )
  );

-- Políticas para pacientes (usuarios del mismo establecimiento)
CREATE POLICY "Pacientes por establecimiento" ON pacientes
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Políticas para profesionales (usuarios del mismo establecimiento)
CREATE POLICY "Profesionales por establecimiento" ON profesionales
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Políticas para turnos (usuarios del mismo establecimiento)
CREATE POLICY "Turnos por establecimiento" ON turnos
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Políticas para aranceles (usuarios del mismo establecimiento)
CREATE POLICY "Aranceles por establecimiento" ON aranceles
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Políticas para prácticas (usuarios del mismo establecimiento)
CREATE POLICY "Practicas por establecimiento" ON practicas
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );
