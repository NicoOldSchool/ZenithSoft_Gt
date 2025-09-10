-- Alter public.users table to make password_hash nullable
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  default_establecimiento_id UUID;
BEGIN
  -- Get the first establecimiento as a default
  SELECT id INTO default_establecimiento_id FROM public.establecimientos LIMIT 1;

  -- Insert a new row into public.users
  INSERT INTO public.users (id, email, nombre, rol, establecimiento_id)
  VALUES (
    new.id,
    new.email,
    substring(new.email from '(.*)@'), -- Use email prefix as nombre
    'Recepcionista', -- Default rol
    default_establecimiento_id
  );
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

