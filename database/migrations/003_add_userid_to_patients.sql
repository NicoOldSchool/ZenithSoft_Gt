-- Añadir la columna user_id a la tabla de pacientes, vinculada a los usuarios de Supabase Auth.
ALTER TABLE public.pacientes
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Activar la Seguridad a Nivel de Fila (RLS) para la tabla de pacientes.
-- Esto es crucial para la seguridad, asegura que las políticas de abajo se apliquen.
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- Crear políticas que definen quién puede hacer qué en la tabla de pacientes.

-- 1. Política de SELECCIÓN: Los usuarios solo pueden ver (SELECT) los pacientes que ellos mismos crearon.
CREATE POLICY "Los usuarios pueden ver sus propios pacientes"
ON public.pacientes FOR SELECT
USING (auth.uid() = user_id);

-- 2. Política de INSERCIÓN: Los usuarios solo pueden crear (INSERT) pacientes para sí mismos.
CREATE POLICY "Los usuarios pueden insertar sus propios pacientes"
ON public.pacientes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Política de ACTUALIZACIÓN: Los usuarios solo pueden actualizar (UPDATE) sus propios pacientes.
CREATE POLICY "Los usuarios pueden actualizar sus propios pacientes"
ON public.pacientes FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Política de ELIMINACIÓN: Los usuarios solo pueden eliminar (DELETE) sus propios pacientes.
CREATE POLICY "Los usuarios pueden eliminar sus propios pacientes"
ON public.pacientes FOR DELETE
USING (auth.uid() = user_id);

