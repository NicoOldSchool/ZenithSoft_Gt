import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('Administrador', 'Recepcionista', 'Profesional', 'Solo lectura').required(),
  establecimiento_id: Joi.string().uuid().required()
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { email, password } = value;

    // Buscar usuario por email
    const result = await pool.query(
      'SELECT id, nombre, email, password_hash, rol, establecimiento_id, activo FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = result.rows[0];

    if (!user.activo) {
      return res.status(401).json({
        error: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Obtener información del establecimiento
    const establecimientoResult = await pool.query(
      'SELECT nombre FROM establecimientos WHERE id = $1',
      [user.establecimiento_id]
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        establecimiento_id: user.establecimiento_id,
        establecimiento_nombre: establecimientoResult.rows[0]?.nombre
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { nombre, email, password, rol, establecimiento_id } = value;

    // Verificar que el establecimiento existe
    const establecimientoResult = await pool.query(
      'SELECT id FROM establecimientos WHERE id = $1',
      [establecimiento_id]
    );

    if (establecimientoResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Establecimiento no encontrado',
        code: 'ESTABLECIMIENTO_NOT_FOUND'
      });
    }

    // Verificar que el email no existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'El email ya está registrado',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const result = await pool.query(
      'INSERT INTO users (nombre, email, password_hash, rol, establecimiento_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol, establecimiento_id',
      [nombre, email, passwordHash, rol, establecimiento_id]
    );

    const newUser = result.rows[0];

    // Generar token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
        establecimiento_id: newUser.establecimiento_id
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Token requerido',
        code: 'TOKEN_REQUIRED'
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.rol, u.establecimiento_id, e.nombre as establecimiento_nombre
       FROM users u 
       LEFT JOIN establecimientos e ON u.establecimiento_id = e.id 
       WHERE u.id = $1 AND u.activo = true`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    next(error);
  }
});

export default router;
