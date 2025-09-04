import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess, hashPassword } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const userSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('Administrador', 'Recepcionista', 'Profesional', 'Solo lectura').required()
});

const userUpdateSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  rol: Joi.string().valid('Administrador', 'Recepcionista', 'Profesional', 'Solo lectura').optional(),
  activo: Joi.boolean().optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/users - Obtener todos los usuarios del establecimiento
router.get('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', rol = '', activo = '', sortBy = 'nombre', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM users 
      WHERE establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];

    // Agregar filtros
    if (search) {
      query += ` AND (LOWER(nombre) LIKE LOWER($2) OR LOWER(email) LIKE LOWER($2))`;
      queryParams.push(`%${search}%`);
    }

    if (rol) {
      query += ` AND rol = $${queryParams.length + 1}`;
      queryParams.push(rol);
    }

    if (activo !== '') {
      query += ` AND activo = $${queryParams.length + 1}`;
      queryParams.push(activo === 'true');
    }

    // Agregar ordenamiento
    const allowedSortFields = ['nombre', 'email', 'rol', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY nombre ASC`;
    }

    // Agregar paginación
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Obtener total de registros para paginación
    let countQuery = `SELECT COUNT(*) FROM users WHERE establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    let countParamIndex = 2;

    if (search) {
      countQuery += ` AND (LOWER(nombre) LIKE LOWER($${countParamIndex}) OR LOWER(email) LIKE LOWER($${countParamIndex}))`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (rol) {
      countQuery += ` AND rol = $${countParamIndex}`;
      countParams.push(rol);
      countParamIndex++;
    }

    if (activo !== '') {
      countQuery += ` AND activo = $${countParamIndex}`;
      countParams.push(activo === 'true');
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Obtener un usuario específico
router.get('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('users'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, nombre, email, rol, activo, created_at, updated_at FROM users WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users - Crear nuevo usuario
router.post('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { nombre, email, password, rol } = value;

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

    const result = await pool.query(
      `INSERT INTO users (nombre, email, password_hash, rol, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, email, rol, activo, created_at, updated_at`,
      [nombre, email, passwordHash, rol, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('users'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Si se está actualizando el email, verificar que no exista otro usuario con ese email
    if (value.email) {
      const emailExists = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [value.email, id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(409).json({
          error: 'Ya existe otro usuario con ese email',
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }
    }

    // Construir query de actualización dinámicamente
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        if (key === 'password') {
          // Hash de la contraseña si se está actualizando
          updateFields.push(`password_hash = $${paramIndex}`);
          updateValues.push(hashPassword(value[key]));
        } else {
          updateFields.push(`${key} = $${paramIndex}`);
          updateValues.push(value[key]);
        }
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron campos para actualizar',
        code: 'NO_UPDATE_FIELDS'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(id);

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, nombre, email, rol, activo, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('users'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el propio usuario
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'No puedes eliminar tu propia cuenta',
        code: 'CANNOT_DELETE_SELF'
      });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
