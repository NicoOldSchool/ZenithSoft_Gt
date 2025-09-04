# 🚀 Guía de Despliegue - Supabase + Vercel

## 📋 Arquitectura

```
Frontend (Next.js) → Vercel
Backend (APIs) → Supabase Edge Functions  
Database → Supabase PostgreSQL
Auth → Supabase Auth
```

## 🔧 Prerrequisitos

### 1. **Cuentas necesarias**
- ✅ [Vercel](https://vercel.com) - Frontend hosting
- ✅ [Supabase](https://supabase.com) - Backend y base de datos
- ✅ [GitHub](https://github.com) - Control de versiones

### 2. **Herramientas locales**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Instalar Supabase CLI
npm i -g supabase
```

## 🚀 Pasos de Despliegue

### **Paso 1: Preparar Supabase**

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota el `Project ID` y las claves

2. **Configurar base de datos**
   ```bash
   npm run db:setup
   ```

3. **Desplegar Edge Functions (opcional)**
   ```bash
   npm run deploy:supabase
   ```

### **Paso 2: Desplegar en Vercel**

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Selecciona el framework: Next.js

2. **Configurar variables de entorno**
   ```bash
   # En Vercel Dashboard o CLI
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

3. **Desplegar**
   ```bash
   npm run deploy:vercel
   ```

## 🔗 URLs de Producción

### **Frontend (Vercel)**
- **URL**: https://tu-app.vercel.app
- **Dashboard**: https://vercel.com/dashboard

### **Backend (Supabase)**
- **Dashboard**: https://supabase.com/dashboard/project/tu-proyecto
- **API**: https://tu-proyecto.supabase.co/rest/v1/
- **Auth**: https://tu-proyecto.supabase.co/auth/v1/

## ⚙️ Configuración Avanzada

### **1. Dominio Personalizado**
1. Ve a Vercel Dashboard → Settings → Domains
2. Agrega tu dominio
3. Configura DNS según las instrucciones

### **2. Variables de Entorno**
```bash
# Variables públicas (frontend)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Variables privadas (servidor)
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
```

### **3. CORS Configuration**
En Supabase Dashboard → Settings → API:
```json
{
  "cors": {
    "allowed_origins": [
      "https://tu-app.vercel.app",
      "http://localhost:3000"
    ]
  }
}
```

## 🔍 Monitoreo y Logs

### **Vercel**
- **Logs**: Vercel Dashboard → Functions
- **Analytics**: Vercel Dashboard → Analytics
- **Performance**: Vercel Dashboard → Speed Insights

### **Supabase**
- **Logs**: Supabase Dashboard → Logs
- **Database**: Supabase Dashboard → Table Editor
- **Auth**: Supabase Dashboard → Authentication

## 🚨 Troubleshooting

### **Error: Build Failed**
```bash
# Verificar dependencias
npm install

# Verificar TypeScript
npm run type-check

# Verificar linting
npm run lint
```

### **Error: Database Connection**
```bash
# Verificar variables de entorno
npm run db:test

# Verificar migraciones
npm run db:check
```

### **Error: Authentication**
1. Verificar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Verificar configuración de Auth en Supabase Dashboard
3. Verificar redirect URLs en Supabase Auth settings

## 📈 Escalabilidad

### **Vercel**
- ✅ **Auto-scaling** automático
- ✅ **Edge Functions** para mejor performance
- ✅ **CDN global** incluido

### **Supabase**
- ✅ **Database scaling** automático
- ✅ **Connection pooling** incluido
- ✅ **Real-time subscriptions** incluido

## 🔒 Seguridad

### **Variables de Entorno**
- ✅ Nunca committear `.env.local` o `.env.production`
- ✅ Usar Vercel Dashboard para variables de producción
- ✅ Rotar claves regularmente

### **CORS**
- ✅ Configurar origins permitidos
- ✅ Usar HTTPS en producción
- ✅ Validar requests del servidor

## 📞 Soporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Documentación**: [docs.vercel.com](https://docs.vercel.com)
