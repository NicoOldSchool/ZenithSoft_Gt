import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        code: 'TOKEN_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const result = await pool.query(
      'SELECT id, nombre, email, rol, establecimiento_id, activo FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].activo) {
      return res.status(401).json({ 
        error: 'Usuario no válido o inactivo',
        code: 'INVALID_USER'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar roles específicos
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
        userRole: req.user.rol
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario pertenece al mismo establecimiento
export const checkEstablecimientoAccess = (resourceTable) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id || req.body.id;
      
      if (!resourceId) {
        return next(); // Si no hay ID, continuar (para operaciones de creación)
      }

      const result = await pool.query(
        `SELECT establecimiento_id FROM ${resourceTable} WHERE id = $1`,
        [resourceId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Recurso no encontrado',
          code: 'RESOURCE_NOT_FOUND'
        });
      }

      const resourceEstablecimientoId = result.rows[0].establecimiento_id;
      
      if (resourceEstablecimientoId !== req.user.establecimiento_id) {
        return res.status(403).json({ 
          error: 'No tienes acceso a este recurso',
          code: 'ESTABLECIMIENTO_ACCESS_DENIED'
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando acceso al establecimiento:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

// Función para generar hash de contraseña
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Función para comparar contraseñas
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Función para generar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
