'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface NewEstablishmentPageProps {
  user: User;
}

export default function NewEstablishmentPage({ user }: NewEstablishmentPageProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleCreateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError('Usuario no autenticado.');
      setLoading(false);
      return;
    }

    try {
      // Create the establishment
      const { data: establishmentData, error: establishmentError } = await supabase
        .from('establecimientos')
        .insert({
          nombre: name,
          owner_id: user.id,
        })
        .select()
        .single();

      if (establishmentError) {
        throw establishmentError;
      }

      // The trigger 'on_establishment_created' should have already created the membership.
      // Now, update the user's profile with the new establishment_id.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ establecimiento_id: establishmentData.id })
        .eq('id', user.id);

      if (profileError) {
        // If updating the profile fails, we should ideally roll back the establishment creation.
        // For simplicity here, we'll just log the error.
        console.error('Error updating profile:', profileError);
        throw new Error('No se pudo asociar el establecimiento con el perfil del usuario.');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Crear Nuevo Establecimiento</h2>
        <p className="text-center text-gray-600">
          ¡Bienvenido! Para comenzar, por favor dale un nombre a tu establecimiento o clínica.
        </p>
        <form onSubmit={handleCreateEstablishment} className="space-y-6">
          <div>
            <label htmlFor="establishment-name" className="block text-sm font-medium text-gray-700">
              Nombre del Establecimiento
            </label>
            <input
              id="establishment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Clínica Dental Sonrisa Feliz"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Establecimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

