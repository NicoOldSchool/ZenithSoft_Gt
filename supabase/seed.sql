-- Insertar establecimientos de ejemplo
INSERT INTO establecimientos (id, nombre) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Clínica San Martín'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Centro Médico Norte');

-- Insertar usuarios de ejemplo
INSERT INTO users (id, nombre, email, rol, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'Admin Principal', 'admin@clinica.com', 'admin', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440004', 'María González', 'recepcion@clinica.com', 'recepcionista', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Dr. Carlos López', 'dr.lopez@clinica.com', 'profesional', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Ana Martínez', 'ana@centro.com', 'admin', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (id, dni, apellido, nombre, telefono, email, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440007', '12345678', 'García', 'Juan', '011-1234-5678', 'juan.garcia@email.com', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440008', '23456789', 'Rodríguez', 'María', '011-2345-6789', 'maria.rodriguez@email.com', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440009', '34567890', 'López', 'Carlos', '011-3456-7890', 'carlos.lopez@email.com', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440010', '45678901', 'Fernández', 'Ana', '011-4567-8901', 'ana.fernandez@email.com', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar profesionales de ejemplo
INSERT INTO profesionales (id, apellido, nombre, telefono, email, especialidad, disponibilidad, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'López', 'Carlos', '011-1111-1111', 'dr.lopez@clinica.com', 'Cardiología', '{"dias": ["Lun", "Mar", "Mie"], "horarios": ["08:00-12:00"], "bloque": 30}', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Martínez', 'Sofia', '011-2222-2222', 'dr.martinez@clinica.com', 'Dermatología', '{"dias": ["Mar", "Jue", "Vie"], "horarios": ["14:00-18:00"], "bloque": 45}', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440013', 'González', 'Roberto', '011-3333-3333', 'dr.gonzalez@centro.com', 'Traumatología', '{"dias": ["Lun", "Mie", "Vie"], "horarios": ["09:00-13:00"], "bloque": 60}', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar aranceles de ejemplo
INSERT INTO aranceles (id, codigo, nombre, categoria, valor, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440014', 'CONS001', 'Consulta General', 'Consultas', 5000.00, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440015', 'CONS002', 'Consulta Especializada', 'Consultas', 8000.00, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440016', 'EST001', 'Estudios de Laboratorio', 'Estudios', 15000.00, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440017', 'CONS003', 'Consulta Traumatológica', 'Consultas', 7000.00, '550e8400-e29b-41d4-a716-446655440002');

-- Insertar turnos de ejemplo
INSERT INTO turnos (id, paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440011', 'Cardiología', '2024-01-15 09:00:00+00', 'programado', 'Primera consulta', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440012', 'Dermatología', '2024-01-15 14:30:00+00', 'programado', 'Control de tratamiento', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440013', 'Traumatología', '2024-01-16 10:00:00+00', 'programado', 'Evaluación post-operatoria', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar prácticas de ejemplo
INSERT INTO practicas (id, codigo, nombre, categoria, turno_id, establecimiento_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', 'PRAC001', 'Electrocardiograma', 'Cardiología', '550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440022', 'PRAC002', 'Biopsia de Piel', 'Dermatología', '550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440023', 'PRAC003', 'Radiografía de Rodilla', 'Traumatología', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002');
