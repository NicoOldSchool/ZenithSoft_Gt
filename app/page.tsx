import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir directamente a login para simplificar
  redirect('/login')
}
