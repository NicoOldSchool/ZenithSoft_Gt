import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const practicaSchema = Joi.object({
  codigo: Joi.string().min(2).max(50).required(),
  nombre: Joi.string().min(2).max(255).required(),
  categoria: Joi.string().max(100).optional(),
  turno_id: Joi.string().uuid().required()
});

const practicaUpdateSchema = Joi.object({
  codigo: Joi.string().min(2).max(50).optional(),
  nombre: Joi.string().min(2).max(255).optional(),
  categoria: Joi.string().max(100).optional(),
  turno_id: Joi.string().uuid().optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/practicas - Obtener todas las prácticas del establecimiento
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', categoria = '', turno_id = '', sortBy = 'nombre', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.id, p.codigo, p.nombre, p.categoria, p.created_at, p.updated_at,
             t.id as turno_id, t.fecha_hora, t.estado,
             pac.apellido as paciente_apellido, pac.nombre as paciente_nombre,
             pr.apellido as profesional_apellido, pr.nombre as profesional_nombre
      FROM practicas p
      LEFT JOIN turnos t ON p.turno_id = t.id
      LEFT JOIN pacientes pac ON t.paciente_id = pac.id
      LEFT JOIN profesionales pr ON t.profesional_id = pr.id
      WHERE p.establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];

    // Agregar filtros
    if (search) {
      query += ` AND (LOWER(p.nombre) LIKE LOWER($2) OR p.codigo LIKE $2)`;
      queryParams.push(`%${search}%`);
    }

    if (categoria) {
      query += ` AND LOWER(p.categoria) LIKE LOWER($${queryParams.length + 1})`;
      queryParams.push(`%${categoria}%`);
    }

    if (turno_id) {
      query += ` AND p.turno_id = $${queryParams.length + 1}`;
      queryParams.push(turno_id);
    }

    // Agregar ordenamiento
    const allowedSortFields = ['nombre', 'codigo', 'categoria', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY p.nombre ASC`;
    }

    // Agregar paginación
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Obtener total de registros para paginación
    let countQuery = `SELECT COUNT(*) FROM practicas p WHERE p.establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    let countParamIndex = 2;

    if (search) {
      countQuery += ` AND (LOWER(p.nombre) LIKE LOWER($${countParamIndex}) OR p.codigo LIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (categoria) {
      countQuery += ` AND LOWER(p.categoria) LIKE LOWER($${countParamIndex})`;
      countParams.push(`%${categoria}%`);
      countParamIndex++;
    }

    if (turno_id) {
      countQuery += ` AND p.turno_id = $${countParamIndex}`;
      countParams.push(turno_id);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      practicas: result.rows,
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

// GET /api/practicas/:id - Obtener una práctica específica
router.get('/:id', checkEstablecimientoAccess('practicas'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.id, p.codigo, p.nombre, p.categoria, p.created_at, p.updated_at,
              t.id as turno_id, t.fecha_hora, t.estado, t.observaciones,
              pac.id as paciente_id, pac.apellido as paciente_apellido, pac.nombre as paciente_nombre,
              pr.id as profesional_id, pr.apellido as profesional_apellido, pr.nombre as profesional_nombre
       FROM practicas p
       LEFT JOIN turnos t ON p.turno_id = t.id
       LEFT JOIN pacientes pac ON t.paciente_id = pac.id
       LEFT JOIN profesionales pr ON t.profesional_id = pr.id
       WHERE p.id = $1 AND p.establecimiento_id = $2`,
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Práctica no encontrada',
        code: 'PRACTICA_NOT_FOUND'
      });
    }

    res.json({
      practica: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/practicas - Crear nueva práctica
router.post('/', authorizeRoles('Administrador', 'Recepcionista'), async (req, res, next) => {
  try {
    const { error, value } = practicaSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { codigo, nombre, categoria, turno_id } = value;

    // Verificar que el turno existe y pertenece al establecimiento
    const turnoResult = await pool.query(
      'SELECT id FROM turnos WHERE id = $1 AND establecimiento_id = $2',
      [turno_id, req.user.establecimiento_id]
    );

    if (turnoResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Turno no encontrado',
        code: 'TURNO_NOT_FOUND'
      });
    }

    const result = await pool.query(
      `INSERT INTO practicas (codigo, nombre, categoria, turno_id, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, codigo, nombre, categoria, turno_id, created_at, updated_at`,
      [codigo, nombre, categoria, turno_id, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Práctica creada exitosamente',
      practica: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/practicas/:id - Actualizar práctica
router.put('/:id', authorizeRoles('Administrador', 'Recepcionista'), checkEstablecimientoAccess('practicas'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = practicaUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que la práctica existe
    const existingPractica = await pool.query(
      'SELECT id FROM practicas WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingPractica.rows.length === 0) {
      return res.status(404).json({
        error: 'Práctica no encontrada',
        code: 'PRACTICA_NOT_FOUND'
      });
    }

    // Verificar que el turno existe si se está actualizando
    if (value.turno_id) {
      const turnoResult = await pool.query(
        'SELECT id FROM turnos WHERE id = $1 AND establecimiento_id = $2',
        [value.turno_id, req.user.establecimiento_id]
      );

      if (turnoResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Turno no encontrado',
          code: 'TURNO_NOT_FOUND'
        });
      }
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
      `UPDATE practicas SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, codigo, nombre, categoria, turno_id, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Práctica actualizada exitosamente',
      practica: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/practicas/:id - Eliminar práctica
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('practicas'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM practicas WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Práctica no encontrada',
        code: 'PRACTICA_NOT_FOUND'
      });
    }

    res.json({
      message: 'Práctica eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
