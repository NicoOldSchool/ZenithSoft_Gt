import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const profesionalSchema = Joi.object({
  apellido: Joi.string().min(2).max(255).required(),
  nombre: Joi.string().min(2).max(255).required(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  especialidad: Joi.string().min(2).max(255).required(),
  disponibilidad: Joi.object().optional()
});

const profesionalUpdateSchema = Joi.object({
  apellido: Joi.string().min(2).max(255).optional(),
  nombre: Joi.string().min(2).max(255).optional(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  especialidad: Joi.string().min(2).max(255).optional(),
  disponibilidad: Joi.object().optional(),
  activo: Joi.boolean().optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/profesionales - Obtener todos los profesionales del establecimiento
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', especialidad = '', activo = '', sortBy = 'apellido', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, apellido, nombre, telefono, email, especialidad, disponibilidad, activo, created_at, updated_at
      FROM profesionales 
      WHERE establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];

    // Agregar filtros
    if (search) {
      query += ` AND (LOWER(apellido) LIKE LOWER($2) OR LOWER(nombre) LIKE LOWER($2) OR LOWER(especialidad) LIKE LOWER($2))`;
      queryParams.push(`%${search}%`);
    }

    if (especialidad) {
      query += ` AND LOWER(especialidad) LIKE LOWER($${queryParams.length + 1})`;
      queryParams.push(`%${especialidad}%`);
    }

    if (activo !== '') {
      query += ` AND activo = $${queryParams.length + 1}`;
      queryParams.push(activo === 'true');
    }

    // Agregar ordenamiento
    const allowedSortFields = ['apellido', 'nombre', 'especialidad', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY apellido ASC`;
    }

    // Agregar paginación
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Obtener total de registros para paginación
    let countQuery = `SELECT COUNT(*) FROM profesionales WHERE establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    let countParamIndex = 2;

    if (search) {
      countQuery += ` AND (LOWER(apellido) LIKE LOWER($${countParamIndex}) OR LOWER(nombre) LIKE LOWER($${countParamIndex}) OR LOWER(especialidad) LIKE LOWER($${countParamIndex}))`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (especialidad) {
      countQuery += ` AND LOWER(especialidad) LIKE LOWER($${countParamIndex})`;
      countParams.push(`%${especialidad}%`);
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
      profesionales: result.rows,
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

// GET /api/profesionales/:id - Obtener un profesional específico
router.get('/:id', checkEstablecimientoAccess('profesionales'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, apellido, nombre, telefono, email, especialidad, disponibilidad, activo, created_at, updated_at FROM profesionales WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Profesional no encontrado',
        code: 'PROFESIONAL_NOT_FOUND'
      });
    }

    res.json({
      profesional: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/profesionales - Crear nuevo profesional
router.post('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { error, value } = profesionalSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { apellido, nombre, telefono, email, especialidad, disponibilidad } = value;

    const result = await pool.query(
      `INSERT INTO profesionales (apellido, nombre, telefono, email, especialidad, disponibilidad, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, apellido, nombre, telefono, email, especialidad, disponibilidad, activo, created_at, updated_at`,
      [apellido, nombre, telefono, email, especialidad, disponibilidad, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Profesional creado exitosamente',
      profesional: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profesionales/:id - Actualizar profesional
router.put('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('profesionales'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = profesionalUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el profesional existe
    const existingProfesional = await pool.query(
      'SELECT id FROM profesionales WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingProfesional.rows.length === 0) {
      return res.status(404).json({
        error: 'Profesional no encontrado',
        code: 'PROFESIONAL_NOT_FOUND'
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
      `UPDATE profesionales SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, apellido, nombre, telefono, email, especialidad, disponibilidad, activo, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Profesional actualizado exitosamente',
      profesional: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/profesionales/:id - Eliminar profesional
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('profesionales'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que no hay turnos asociados
    const turnosResult = await pool.query(
      'SELECT id FROM turnos WHERE profesional_id = $1',
      [id]
    );

    if (turnosResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el profesional porque tiene turnos asociados',
        code: 'PROFESIONAL_HAS_APPOINTMENTS'
      });
    }

    const result = await pool.query(
      'DELETE FROM profesionales WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Profesional no encontrado',
        code: 'PROFESIONAL_NOT_FOUND'
      });
    }

    res.json({
      message: 'Profesional eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
