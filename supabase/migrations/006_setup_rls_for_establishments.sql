-- Function to get the establishment_id for the current user from the 'miembros_establecimiento' table.
CREATE OR REPLACE FUNCTION get_my_establishment_id()
RETURNS UUID AS $$
DECLARE
    establishment_id UUID;
BEGIN
    SELECT m.establecimiento_id INTO establishment_id
    FROM public.miembros_establecimiento m
    WHERE m.user_id = auth.uid()
    LIMIT 1;
    RETURN establishment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS for all relevant tables
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miembros_establecimiento ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for members of the same establishment" ON public.pacientes;
DROP POLICY IF EXISTS "Enable full access for establishment admins" ON public.pacientes;
DROP POLICY IF EXISTS "Enable read access for members of the same establishment" ON public.profesionales;
DROP POLICY IF EXISTS "Enable full access for establishment admins" ON public.profesionales;
DROP POLICY IF EXISTS "Enable read access for members of the same establishment" ON public.practicas;
DROP POLICY IF EXISTS "Enable full access for establishment admins" ON public.practicas;
DROP POLICY IF EXISTS "Enable read access for members" ON public.establecimientos;
DROP POLICY IF EXISTS "Enable full access for establishment admins" ON public.establecimientos;
DROP POLICY IF EXISTS "Enable read access for members of the same establishment" ON public.miembros_establecimiento;
DROP POLICY IF EXISTS "Enable full access for establishment admins" ON public.miembros_establecimiento;


-- Create RLS policies for 'pacientes'
CREATE POLICY "Enable read access for members of the same establishment" ON public.pacientes
FOR SELECT USING (establecimiento_id = get_my_establishment_id());

CREATE POLICY "Enable full access for establishment admins" ON public.pacientes
FOR ALL USING (establecimiento_id = get_my_establishment_id())
WITH CHECK (
    establecimiento_id = get_my_establishment_id() AND
    (
        SELECT role FROM public.miembros_establecimiento
        WHERE user_id = auth.uid() AND establecimiento_id = get_my_establishment_id()
    ) = 'admin'
);

-- Create RLS policies for 'profesionales'
CREATE POLICY "Enable read access for members of the same establishment" ON public.profesionales
FOR SELECT USING (establecimiento_id = get_my_establishment_id());

CREATE POLICY "Enable full access for establishment admins" ON public.profesionales
FOR ALL USING (establecimiento_id = get_my_establishment_id())
WITH CHECK (
    establecimiento_id = get_my_establishment_id() AND
    (
        SELECT role FROM public.miembros_establecimiento
        WHERE user_id = auth.uid() AND establecimiento_id = get_my_establishment_id()
    ) = 'admin'
);

-- Create RLS policies for 'practicas'
CREATE POLICY "Enable read access for members of the same establishment" ON public.practicas
FOR SELECT USING (establecimiento_id = get_my_establishment_id());

CREATE POLICY "Enable full access for establishment admins" ON public.practicas
FOR ALL USING (establecimiento_id = get_my_establishment_id())
WITH CHECK (
    establecimiento_id = get_my_establishment_id() AND
    (
        SELECT role FROM public.miembros_establecimiento
        WHERE user_id = auth.uid() AND establecimiento_id = get_my_establishment_id()
    ) = 'admin'
);

-- RLS policies for 'establecimientos'
CREATE POLICY "Enable read access for members" ON public.establecimientos
FOR SELECT USING (id = get_my_establishment_id());

CREATE POLICY "Enable full access for establishment admins" ON public.establecimientos
FOR ALL USING (id = get_my_establishment_id() AND owner_id = auth.uid())
WITH CHECK (id = get_my_establishment_id() AND owner_id = auth.uid());


-- RLS policies for 'miembros_establecimiento'
CREATE POLICY "Enable read access for members of the same establishment" ON public.miembros_establecimiento
FOR SELECT USING (establecimiento_id = get_my_establishment_id());

CREATE POLICY "Enable full access for establishment admins" ON public.miembros_establecimiento
FOR ALL USING (establecimiento_id = get_my_establishment_id())
WITH CHECK (
    establecimiento_id = get_my_establishment_id() AND
    (
        SELECT role FROM public.miembros_establecimiento
        WHERE user_id = auth.uid() AND establecimiento_id = get_my_establishment_id()
    ) = 'admin'
);

