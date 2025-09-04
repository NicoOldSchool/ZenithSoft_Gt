import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const establecimientoSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).required(),
  direccion: Joi.string().max(500).optional(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional()
});

const establecimientoUpdateSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).optional(),
  direccion: Joi.string().max(500).optional(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/establecimientos - Obtener todos los establecimientos (solo para administradores globales)
router.get('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'nombre', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, nombre, direccion, telefono, email, created_at, updated_at
      FROM establecimientos 
    `;
    const queryParams = [];

    // Agregar filtros
    if (search) {
      query += ` WHERE LOWER(nombre) LIKE LOWER($1) OR LOWER(direccion) LIKE LOWER($1)`;
      queryParams.push(`%${search}%`);
    }

    // Agregar ordenamiento
    const allowedSortFields = ['nombre', 'direccion', 'created_at'];
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
    let countQuery = `SELECT COUNT(*) FROM establecimientos`;
    const countParams = [];

    if (search) {
      countQuery += ` WHERE LOWER(nombre) LIKE LOWER($1) OR LOWER(direccion) LIKE LOWER($1)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      establecimientos: result.rows,
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

// GET /api/establecimientos/:id - Obtener un establecimiento específico
router.get('/:id', checkEstablecimientoAccess('establecimientos'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, nombre, direccion, telefono, email, created_at, updated_at FROM establecimientos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado',
        code: 'ESTABLECIMIENTO_NOT_FOUND'
      });
    }

    res.json({
      establecimiento: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/establecimientos - Crear nuevo establecimiento
router.post('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { error, value } = establecimientoSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { nombre, direccion, telefono, email } = value;

    const result = await pool.query(
      `INSERT INTO establecimientos (nombre, direccion, telefono, email) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nombre, direccion, telefono, email, created_at, updated_at`,
      [nombre, direccion, telefono, email]
    );

    res.status(201).json({
      message: 'Establecimiento creado exitosamente',
      establecimiento: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/establecimientos/:id - Actualizar establecimiento
router.put('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('establecimientos'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = establecimientoUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el establecimiento existe
    const existingEstablecimiento = await pool.query(
      'SELECT id FROM establecimientos WHERE id = $1',
      [id]
    );

    if (existingEstablecimiento.rows.length === 0) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado',
        code: 'ESTABLECIMIENTO_NOT_FOUND'
      });
    }

    // Construir query de actualización dinámicamente
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(value[key]);
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
      `UPDATE establecimientos SET ${updateFields.join(', ')} WHERE id = $${paramIndex} 
       RETURNING id, nombre, direccion, telefono, email, created_at, updated_at`,
      updateValues
    );

    res.json({
      message: 'Establecimiento actualizado exitosamente',
      establecimiento: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/establecimientos/:id - Eliminar establecimiento
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('establecimientos'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que no hay usuarios asociados
    const usuariosResult = await pool.query(
      'SELECT id FROM users WHERE establecimiento_id = $1',
      [id]
    );

    if (usuariosResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el establecimiento porque tiene usuarios asociados',
        code: 'ESTABLECIMIENTO_HAS_USERS'
      });
    }

    // Verificar que no hay pacientes asociados
    const pacientesResult = await pool.query(
      'SELECT id FROM pacientes WHERE establecimiento_id = $1',
      [id]
    );

    if (pacientesResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el establecimiento porque tiene pacientes asociados',
        code: 'ESTABLECIMIENTO_HAS_PATIENTS'
      });
    }

    // Verificar que no hay profesionales asociados
    const profesionalesResult = await pool.query(
      'SELECT id FROM profesionales WHERE establecimiento_id = $1',
      [id]
    );

    if (profesionalesResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el establecimiento porque tiene profesionales asociados',
        code: 'ESTABLECIMIENTO_HAS_PROFESSIONALS'
      });
    }

    const result = await pool.query(
      'DELETE FROM establecimientos WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Establecimiento no encontrado',
        code: 'ESTABLECIMIENTO_NOT_FOUND'
      });
    }

    res.json({
      message: 'Establecimiento eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
