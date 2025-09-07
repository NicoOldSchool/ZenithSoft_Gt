-- Migración para crear tabla de pacientes con validaciones
-- Fase 2: Sistema de Pacientes

-- Crear tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni VARCHAR(20) UNIQUE NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE,
  sexo VARCHAR(10) CHECK (sexo IN ('M', 'F', 'Otro')),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  obra_social VARCHAR(100),
  numero_afiliado VARCHAR(50),
  observaciones TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pacientes_dni ON pacientes(dni);
CREATE INDEX IF NOT EXISTS idx_pacientes_apellido ON pacientes(apellido);
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON pacientes(nombre);
CREATE INDEX IF NOT EXISTS idx_pacientes_activo ON pacientes(activo);

-- Crear tabla de historial médico básico
CREATE TABLE IF NOT EXISTS historial_medico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  fecha_consulta DATE NOT NULL DEFAULT CURRENT_DATE,
  profesional_id UUID REFERENCES profesionales(id),
  motivo_consulta TEXT,
  diagnostico TEXT,
  tratamiento TEXT,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para el historial
CREATE INDEX IF NOT EXISTS idx_historial_paciente ON historial_medico(paciente_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_medico(fecha_consulta);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_pacientes_updated_at 
    BEFORE UPDATE ON pacientes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historial_updated_at 
    BEFORE UPDATE ON historial_medico 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_medico ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pacientes
CREATE POLICY "Pacientes para usuarios autenticados" ON pacientes
  FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- Políticas RLS para historial médico
CREATE POLICY "Historial para usuarios autenticados" ON historial_medico
  FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- Insertar algunos pacientes de ejemplo
INSERT INTO pacientes (dni, apellido, nombre, fecha_nacimiento, sexo, telefono, email, direccion, obra_social) VALUES
('12345678', 'García', 'María', '1985-03-15', 'F', '011-1234-5678', 'maria.garcia@email.com', 'Av. Corrientes 1234', 'OSDE'),
('87654321', 'López', 'Juan', '1990-07-22', 'M', '011-8765-4321', 'juan.lopez@email.com', 'Av. Santa Fe 5678', 'Swiss Medical'),
('11223344', 'Martínez', 'Ana', '1978-11-08', 'F', '011-1122-3344', 'ana.martinez@email.com', 'Av. Córdoba 9012', 'Galeno'),
('55667788', 'Rodríguez', 'Carlos', '1992-05-30', 'M', '011-5566-7788', 'carlos.rodriguez@email.com', 'Av. Rivadavia 3456', 'Medicus'),
('99887766', 'Fernández', 'Laura', '1987-09-12', 'F', '011-9988-7766', 'laura.fernandez@email.com', 'Av. Callao 7890', 'OSDE');

-- Insertar algunos registros de historial de ejemplo
INSERT INTO historial_medico (paciente_id, motivo_consulta, diagnostico, tratamiento, observaciones) VALUES
((SELECT id FROM pacientes WHERE dni = '12345678'), 'Control de presión arterial', 'Hipertensión leve', 'Dieta baja en sodio, ejercicio regular', 'Paciente colaboradora'),
((SELECT id FROM pacientes WHERE dni = '87654321'), 'Dolor de cabeza', 'Migraña tensional', 'Analgésicos, relajación', 'Seguimiento en 15 días'),
((SELECT id FROM pacientes WHERE dni = '11223344'), 'Control anual', 'Sin patologías', 'Continuar hábitos saludables', 'Paciente sana');

COMMENT ON TABLE pacientes IS 'Tabla de pacientes del sistema médico';
COMMENT ON TABLE historial_medico IS 'Historial médico básico de los pacientes';
COMMENT ON COLUMN pacientes.dni IS 'DNI único del paciente';
COMMENT ON COLUMN pacientes.sexo IS 'Sexo: M (Masculino), F (Femenino), Otro';
COMMENT ON COLUMN pacientes.activo IS 'Indica si el paciente está activo en el sistema';
