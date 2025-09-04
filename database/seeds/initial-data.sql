-- Datos iniciales para el sistema de turnos médicos

-- Insertar establecimientos de ejemplo
INSERT INTO establecimientos (id, nombre, direccion, telefono, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Clínica San Martín', 'Av. San Martín 1234, CABA', '+54 11 1234-5678', 'info@clinicasanmartin.com'),
('550e8400-e29b-41d4-a716-446655440002', 'Centro Médico Norte', 'Belgrano 567, CABA', '+54 11 9876-5432', 'contacto@centromediconorte.com');

-- Insertar usuarios de ejemplo (password: 'password123' hasheado con bcrypt)
INSERT INTO users (id, nombre, email, password_hash, rol, establecimiento_id) VALUES
-- Establecimiento 1
('660e8400-e29b-41d4-a716-446655440001', 'Dr. Juan Pérez', 'juan.perez@clinicasanmartin.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'Administrador', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'María González', 'maria.gonzalez@clinicasanmartin.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'Recepcionista', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440003', 'Dr. Carlos Rodríguez', 'carlos.rodriguez@clinicasanmartin.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'Profesional', '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('660e8400-e29b-41d4-a716-446655440004', 'Ana López', 'ana.lopez@centromediconorte.com', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ', 'Administrador', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (id, dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, establecimiento_id) VALUES
-- Establecimiento 1
('770e8400-e29b-41d4-a716-446655440001', '12345678', 'García', 'ale', '+54 11 1111-1111', 'ale.garcia@email.com', '1990-05-15', 'Av. Corrientes 123, CABA', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', '23456789', 'Martínez', 'María', '+54 11 2222-2222', 'maria.martinez@email.com', '1985-08-22', 'Rivadavia 456, CABA', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', '34567890', 'López', 'Carlos', '+54 11 3333-3333', 'carlos.lopez@email.com', '1978-12-10', 'San Juan 789, CABA', '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('770e8400-e29b-41d4-a716-446655440004', '45678901', 'Fernández', 'Laura', '+54 11 4444-4444', 'laura.fernandez@email.com', '1992-03-28', 'Belgrano 321, CABA', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar profesionales de ejemplo
INSERT INTO profesionales (id, apellido, nombre, telefono, email, especialidad, disponibilidad, establecimiento_id) VALUES
-- Establecimiento 1
('880e8400-e29b-41d4-a716-446655440001', 'Pérez', 'Juan', '+54 11 5555-5555', 'dr.juan.perez@clinicasanmartin.com', 'Cardiología', '{"lunes": {"inicio": "08:00", "fin": "17:00"}, "martes": {"inicio": "08:00", "fin": "17:00"}, "miercoles": {"inicio": "08:00", "fin": "17:00"}, "jueves": {"inicio": "08:00", "fin": "17:00"}, "viernes": {"inicio": "08:00", "fin": "17:00"}}', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'Rodríguez', 'Carlos', '+54 11 6666-6666', 'dr.carlos.rodriguez@clinicasanmartin.com', 'Traumatología', '{"lunes": {"inicio": "09:00", "fin": "18:00"}, "martes": {"inicio": "09:00", "fin": "18:00"}, "jueves": {"inicio": "09:00", "fin": "18:00"}, "viernes": {"inicio": "09:00", "fin": "18:00"}}', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'González', 'Ana', '+54 11 7777-7777', 'dra.ana.gonzalez@clinicasanmartin.com', 'Pediatría', '{"lunes": {"inicio": "08:00", "fin": "16:00"}, "miercoles": {"inicio": "08:00", "fin": "16:00"}, "viernes": {"inicio": "08:00", "fin": "16:00"}}', '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('880e8400-e29b-41d4-a716-446655440004', 'Silva', 'Roberto', '+54 11 8888-8888', 'dr.roberto.silva@centromediconorte.com', 'Dermatología', '{"martes": {"inicio": "10:00", "fin": "19:00"}, "jueves": {"inicio": "10:00", "fin": "19:00"}, "sabado": {"inicio": "09:00", "fin": "14:00"}}', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar aranceles de ejemplo
INSERT INTO aranceles (id, codigo, nombre, categoria, valor, establecimiento_id) VALUES
-- Establecimiento 1
('990e8400-e29b-41d4-a716-446655440001', 'CONS001', 'Consulta General', 'Consulta', 5000.00, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', 'CONS002', 'Consulta Especialista', 'Consulta', 8000.00, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440003', 'EST001', 'Electrocardiograma', 'Estudio', 15000.00, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440004', 'EST002', 'Radiografía', 'Estudio', 12000.00, '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('990e8400-e29b-41d4-a716-446655440005', 'CONS001', 'Consulta General', 'Consulta', 4500.00, '550e8400-e29b-41d4-a716-446655440002'),
('990e8400-e29b-41d4-a716-446655440006', 'DERM001', 'Consulta Dermatológica', 'Consulta', 7000.00, '550e8400-e29b-41d4-a716-446655440002');

-- Insertar turnos de ejemplo
INSERT INTO turnos (id, paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones, establecimiento_id) VALUES
-- Establecimiento 1
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Cardiología', '2024-01-15 10:00:00+00', 'Confirmado', 'Primera consulta', '550e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Traumatología', '2024-01-16 14:30:00+00', 'Pendiente', 'Control post operatorio', '550e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Pediatría', '2024-01-17 09:00:00+00', 'Pendiente', 'Control de rutina', '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Dermatología', '2024-01-18 11:00:00+00', 'Confirmado', 'Consulta por manchas en la piel', '550e8400-e29b-41d4-a716-446655440002');

-- Insertar prácticas de ejemplo
INSERT INTO practicas (id, codigo, nombre, categoria, turno_id, establecimiento_id) VALUES
-- Establecimiento 1
('bb0e8400-e29b-41d4-a716-446655440001', 'EST001', 'Electrocardiograma', 'Estudio', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440002', 'EST002', 'Radiografía de rodilla', 'Estudio', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
-- Establecimiento 2
('bb0e8400-e29b-41d4-a716-446655440003', 'DERM001', 'Biopsia de piel', 'Estudio', 'aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');
