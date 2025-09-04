import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const pacienteSchema = Joi.object({
  dni: Joi.string().min(7).max(20).required(),
  apellido: Joi.string().min(2).max(255).required(),
  nombre: Joi.string().min(2).max(255).required(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  fecha_nacimiento: Joi.date().max('now').optional(),
  direccion: Joi.string().max(500).optional()
});

const pacienteUpdateSchema = Joi.object({
  dni: Joi.string().min(7).max(20).optional(),
  apellido: Joi.string().min(2).max(255).optional(),
  nombre: Joi.string().min(2).max(255).optional(),
  telefono: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  fecha_nacimiento: Joi.date().max('now').optional(),
  direccion: Joi.string().max(500).optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/pacientes - Obtener todos los pacientes del establecimiento
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'apellido', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, created_at, updated_at
      FROM pacientes 
      WHERE establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];

    // Agregar búsqueda si se proporciona
    if (search) {
      query += ` AND (LOWER(apellido) LIKE LOWER($2) OR LOWER(nombre) LIKE LOWER($2) OR dni LIKE $2)`;
      queryParams.push(`%${search}%`);
    }

    // Agregar ordenamiento
    const allowedSortFields = ['apellido', 'nombre', 'dni', 'created_at'];
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
    let countQuery = `SELECT COUNT(*) FROM pacientes WHERE establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    
    if (search) {
      countQuery += ` AND (LOWER(apellido) LIKE LOWER($2) OR LOWER(nombre) LIKE LOWER($2) OR dni LIKE $2)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      pacientes: result.rows,
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

// GET /api/pacientes/:id - Obtener un paciente específico
router.get('/:id', checkEstablecimientoAccess('pacientes'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, created_at, updated_at FROM pacientes WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
        code: 'PACIENTE_NOT_FOUND'
      });
    }

    res.json({
      paciente: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/pacientes - Crear nuevo paciente
router.post('/', authorizeRoles('Administrador', 'Recepcionista'), async (req, res, next) => {
  try {
    const { error, value } = pacienteSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion } = value;

    // Verificar que el DNI no existe en el establecimiento
    const existingPaciente = await pool.query(
      'SELECT id FROM pacientes WHERE dni = $1 AND establecimiento_id = $2',
      [dni, req.user.establecimiento_id]
    );

    if (existingPaciente.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe un paciente con ese DNI',
        code: 'DNI_ALREADY_EXISTS'
      });
    }

    const result = await pool.query(
      `INSERT INTO pacientes (dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, created_at, updated_at`,
      [dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Paciente creado exitosamente',
      paciente: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/pacientes/:id - Actualizar paciente
router.put('/:id', authorizeRoles('Administrador', 'Recepcionista'), checkEstablecimientoAccess('pacientes'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = pacienteUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el paciente existe
    const existingPaciente = await pool.query(
      'SELECT id FROM pacientes WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingPaciente.rows.length === 0) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
        code: 'PACIENTE_NOT_FOUND'
      });
    }

    // Si se está actualizando el DNI, verificar que no exista otro paciente con ese DNI
    if (value.dni) {
      const dniExists = await pool.query(
        'SELECT id FROM pacientes WHERE dni = $1 AND establecimiento_id = $2 AND id != $3',
        [value.dni, req.user.establecimiento_id, id]
      );

      if (dniExists.rows.length > 0) {
        return res.status(409).json({
          error: 'Ya existe otro paciente con ese DNI',
          code: 'DNI_ALREADY_EXISTS'
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
      `UPDATE pacientes SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, dni, apellido, nombre, telefono, email, fecha_nacimiento, direccion, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Paciente actualizado exitosamente',
      paciente: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/pacientes/:id - Eliminar paciente
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('pacientes'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que no hay turnos asociados
    const turnosResult = await pool.query(
      'SELECT id FROM turnos WHERE paciente_id = $1',
      [id]
    );

    if (turnosResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el paciente porque tiene turnos asociados',
        code: 'PACIENTE_HAS_APPOINTMENTS'
      });
    }

    const result = await pool.query(
      'DELETE FROM pacientes WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
        code: 'PACIENTE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Paciente eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
