# Sistema Médico - Next.js + Supabase

Una aplicación web moderna para la gestión de citas médicas, pacientes, profesionales y prácticas médicas, construida con **Next.js 14** y **Supabase**.

## 🚀 Características

- **Next.js 14** con App Router y Server Components
- **Supabase** para autenticación y base de datos PostgreSQL
- **TypeScript** para type safety completo
- **Tailwind CSS** para estilos modernos y responsive
- **React Query** para gestión de estado del servidor
- **Row Level Security (RLS)** para aislamiento de datos por establecimiento
- **Autenticación** con roles (admin, recepcionista, profesional, lectura)
- **Arquitectura modular** preparada para expansión

## 🏗️ Arquitectura

```
├── app/                    # Next.js App Router
│   ├── dashboard/          # Páginas del dashboard
│   ├── login/             # Página de autenticación
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
├── lib/                  # Utilidades y configuración
├── types/                # Tipos TypeScript
├── supabase/            # Migraciones y seeds
└── public/              # Archivos estáticos
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Framework de estilos
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

### Backend (Supabase)
- **PostgreSQL** - Base de datos
- **Row Level Security** - Seguridad a nivel de fila
- **Auth** - Autenticación y autorización
- **Real-time** - Suscripciones en tiempo real
- **Storage** - Almacenamiento de archivos

## 📊 Base de Datos

### Tablas Principales

```sql
-- Establecimientos
establecimientos (id, nombre, created_at, updated_at)

-- Usuarios (extendiendo auth.users)
users (id, nombre, email, rol, establecimiento_id)

-- Pacientes
pacientes (id, dni, apellido, nombre, telefono, email, establecimiento_id)

-- Profesionales
profesionales (id, apellido, nombre, telefono, email, especialidad, disponibilidad, activo, establecimiento_id)

-- Turnos
turnos (id, paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones, establecimiento_id)

-- Aranceles
aranceles (id, codigo, nombre, categoria, valor, activo, establecimiento_id)

-- Prácticas
practicas (id, codigo, nombre, categoria, turno_id, establecimiento_id)
```

### Seguridad (RLS)

- **Aislamiento por establecimiento**: Cada usuario solo ve datos de su establecimiento
- **Roles y permisos**: Diferentes niveles de acceso según el rol
- **Validación automática**: Triggers para mantener integridad de datos

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd sistema-medico-nextjs
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase
1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones en el SQL Editor:
   ```bash
   # Copiar y ejecutar el contenido de supabase/migrations/001_initial_schema.sql
   ```
3. Ejecutar los datos de ejemplo:
   ```bash
   # Copiar y ejecutar el contenido de supabase/seed.sql
   ```

### 4. Configurar variables de entorno
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

## 📱 Uso

### Roles de Usuario

1. **Admin**: Acceso completo al sistema
   - Gestión de usuarios y establecimientos
   - Todas las operaciones CRUD

2. **Recepcionista**: Gestión de pacientes y turnos
   - Crear y gestionar turnos
   - Administrar pacientes
   - Ver aranceles y profesionales

3. **Profesional**: Acceso limitado
   - Ver turnos asignados
   - Ver pacientes y prácticas relacionadas
   - Acceso de solo lectura

4. **Lectura**: Solo consultas
   - Ver información sin capacidad de modificación

### Funcionalidades Principales

- **Dashboard**: Estadísticas y turnos próximos
- **Turnos**: Gestión completa de citas médicas
- **Pacientes**: Registro y gestión de pacientes
- **Profesionales**: Gestión de profesionales médicos
- **Aranceles**: Configuración de precios y servicios
- **Prácticas**: Registro de prácticas médicas realizadas

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Proveedores
- **Netlify**: Compatible con Next.js
- **Railway**: Para aplicaciones full-stack
- **DigitalOcean**: App Platform

## 🔒 Seguridad

- **Row Level Security (RLS)**: Aislamiento automático de datos
- **Autenticación JWT**: Tokens seguros con Supabase Auth
- **Validación de entrada**: Zod para validación de esquemas
- **CORS**: Configuración segura para APIs
- **Rate Limiting**: Protección contra ataques

## 📈 Rendimiento

- **Server Components**: Renderizado en servidor para mejor SEO
- **Static Generation**: Páginas estáticas cuando es posible
- **Image Optimization**: Optimización automática de imágenes
- **Code Splitting**: Carga automática de código
- **Caching**: Estrategias de caché inteligentes

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Abrir un issue en el repositorio
- Consultar la documentación de [Next.js](https://nextjs.org/docs)
- Consultar la documentación de [Supabase](https://supabase.com/docs)

## 🔄 Migración desde React + Express

Si estás migrando desde la versión anterior:

1. **Base de datos**: Las migraciones son compatibles
2. **Autenticación**: Cambiar de JWT manual a Supabase Auth
3. **API**: Reemplazar Express routes con Server Actions o API Routes
4. **Estado**: Migrar de React Query a Server Components + React Query
5. **Estilos**: Tailwind CSS se mantiene igual

## 🎯 Próximos Pasos

- [ ] Implementar formularios de creación/edición
- [ ] Agregar funcionalidad de eliminación
- [ ] Implementar búsqueda y filtros avanzados
- [ ] Agregar reportes y estadísticas
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar exportación de datos
- [ ] Implementar backup automático
