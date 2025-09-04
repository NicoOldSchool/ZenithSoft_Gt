import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const turnoSchema = Joi.object({
  paciente_id: Joi.string().uuid().required(),
  profesional_id: Joi.string().uuid().required(),
  especialidad: Joi.string().min(2).max(255).required(),
  fecha_hora: Joi.date().greater('now').required(),
  estado: Joi.string().valid('Pendiente', 'Confirmado', 'Cancelado', 'Completado', 'No asistió').default('Pendiente'),
  observaciones: Joi.string().max(1000).optional()
});

const turnoUpdateSchema = Joi.object({
  paciente_id: Joi.string().uuid().optional(),
  profesional_id: Joi.string().uuid().optional(),
  especialidad: Joi.string().min(2).max(255).optional(),
  fecha_hora: Joi.date().greater('now').optional(),
  estado: Joi.string().valid('Pendiente', 'Confirmado', 'Cancelado', 'Completado', 'No asistió').optional(),
  observaciones: Joi.string().max(1000).optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/turnos - Obtener todos los turnos del establecimiento
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      estado = '', 
      fecha_desde = '', 
      fecha_hasta = '',
      profesional_id = '',
      sortBy = 'fecha_hora', 
      sortOrder = 'ASC' 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.id, t.especialidad, t.fecha_hora, t.estado, t.observaciones, t.created_at, t.updated_at,
             p.id as paciente_id, p.dni, p.apellido as paciente_apellido, p.nombre as paciente_nombre, p.telefono as paciente_telefono,
             pr.id as profesional_id, pr.apellido as profesional_apellido, pr.nombre as profesional_nombre, pr.especialidad as profesional_especialidad
      FROM turnos t
      LEFT JOIN pacientes p ON t.paciente_id = p.id
      LEFT JOIN profesionales pr ON t.profesional_id = pr.id
      WHERE t.establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];
    let paramIndex = 2;

    // Agregar filtros
    if (search) {
      query += ` AND (LOWER(p.apellido) LIKE LOWER($${paramIndex}) OR LOWER(p.nombre) LIKE LOWER($${paramIndex}) OR p.dni LIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (estado) {
      query += ` AND t.estado = $${paramIndex}`;
      queryParams.push(estado);
      paramIndex++;
    }

    if (fecha_desde) {
      query += ` AND t.fecha_hora >= $${paramIndex}`;
      queryParams.push(fecha_desde);
      paramIndex++;
    }

    if (fecha_hasta) {
      query += ` AND t.fecha_hora <= $${paramIndex}`;
      queryParams.push(fecha_hasta);
      paramIndex++;
    }

    if (profesional_id) {
      query += ` AND t.profesional_id = $${paramIndex}`;
      queryParams.push(profesional_id);
      paramIndex++;
    }

    // Agregar ordenamiento
    const allowedSortFields = ['fecha_hora', 'estado', 'paciente_apellido', 'profesional_apellido'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY t.fecha_hora ASC`;
    }

    // Agregar paginación
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Obtener total de registros para paginación
    let countQuery = `SELECT COUNT(*) FROM turnos t WHERE t.establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    let countParamIndex = 2;

    if (search) {
      countQuery += ` AND EXISTS (SELECT 1 FROM pacientes p WHERE t.paciente_id = p.id AND (LOWER(p.apellido) LIKE LOWER($${countParamIndex}) OR LOWER(p.nombre) LIKE LOWER($${countParamIndex}) OR p.dni LIKE $${countParamIndex}))`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (estado) {
      countQuery += ` AND t.estado = $${countParamIndex}`;
      countParams.push(estado);
      countParamIndex++;
    }

    if (fecha_desde) {
      countQuery += ` AND t.fecha_hora >= $${countParamIndex}`;
      countParams.push(fecha_desde);
      countParamIndex++;
    }

    if (fecha_hasta) {
      countQuery += ` AND t.fecha_hora <= $${countParamIndex}`;
      countParams.push(fecha_hasta);
      countParamIndex++;
    }

    if (profesional_id) {
      countQuery += ` AND t.profesional_id = $${countParamIndex}`;
      countParams.push(profesional_id);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      turnos: result.rows,
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

// GET /api/turnos/:id - Obtener un turno específico
router.get('/:id', checkEstablecimientoAccess('turnos'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.id, t.especialidad, t.fecha_hora, t.estado, t.observaciones, t.created_at, t.updated_at,
              p.id as paciente_id, p.dni, p.apellido as paciente_apellido, p.nombre as paciente_nombre, p.telefono as paciente_telefono, p.email as paciente_email,
              pr.id as profesional_id, pr.apellido as profesional_apellido, pr.nombre as profesional_nombre, pr.especialidad as profesional_especialidad, pr.telefono as profesional_telefono
       FROM turnos t
       LEFT JOIN pacientes p ON t.paciente_id = p.id
       LEFT JOIN profesionales pr ON t.profesional_id = pr.id
       WHERE t.id = $1 AND t.establecimiento_id = $2`,
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Turno no encontrado',
        code: 'TURNO_NOT_FOUND'
      });
    }

    res.json({
      turno: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/turnos - Crear nuevo turno
router.post('/', authorizeRoles('Administrador', 'Recepcionista'), async (req, res, next) => {
  try {
    const { error, value } = turnoSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones } = value;

    // Verificar que el paciente existe y pertenece al establecimiento
    const pacienteResult = await pool.query(
      'SELECT id FROM pacientes WHERE id = $1 AND establecimiento_id = $2',
      [paciente_id, req.user.establecimiento_id]
    );

    if (pacienteResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Paciente no encontrado',
        code: 'PACIENTE_NOT_FOUND'
      });
    }

    // Verificar que el profesional existe y pertenece al establecimiento
    const profesionalResult = await pool.query(
      'SELECT id FROM profesionales WHERE id = $1 AND establecimiento_id = $2',
      [profesional_id, req.user.establecimiento_id]
    );

    if (profesionalResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Profesional no encontrado',
        code: 'PROFESIONAL_NOT_FOUND'
      });
    }

    // Verificar que no hay conflicto de horario para el profesional
    const conflictoResult = await pool.query(
      `SELECT id FROM turnos 
       WHERE profesional_id = $1 
       AND fecha_hora = $2 
       AND estado NOT IN ('Cancelado', 'No asistió')
       AND establecimiento_id = $3`,
      [profesional_id, fecha_hora, req.user.establecimiento_id]
    );

    if (conflictoResult.rows.length > 0) {
      return res.status(409).json({
        error: 'El profesional ya tiene un turno en ese horario',
        code: 'SCHEDULE_CONFLICT'
      });
    }

    const result = await pool.query(
      `INSERT INTO turnos (paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, especialidad, fecha_hora, estado, observaciones, created_at, updated_at`,
      [paciente_id, profesional_id, especialidad, fecha_hora, estado, observaciones, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Turno creado exitosamente',
      turno: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/turnos/:id - Actualizar turno
router.put('/:id', authorizeRoles('Administrador', 'Recepcionista'), checkEstablecimientoAccess('turnos'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = turnoUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el turno existe
    const existingTurno = await pool.query(
      'SELECT id FROM turnos WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingTurno.rows.length === 0) {
      return res.status(404).json({
        error: 'Turno no encontrado',
        code: 'TURNO_NOT_FOUND'
      });
    }

    // Verificar referencias si se están actualizando
    if (value.paciente_id) {
      const pacienteResult = await pool.query(
        'SELECT id FROM pacientes WHERE id = $1 AND establecimiento_id = $2',
        [value.paciente_id, req.user.establecimiento_id]
      );

      if (pacienteResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Paciente no encontrado',
          code: 'PACIENTE_NOT_FOUND'
        });
      }
    }

    if (value.profesional_id) {
      const profesionalResult = await pool.query(
        'SELECT id FROM profesionales WHERE id = $1 AND establecimiento_id = $2',
        [value.profesional_id, req.user.establecimiento_id]
      );

      if (profesionalResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Profesional no encontrado',
          code: 'PROFESIONAL_NOT_FOUND'
        });
      }
    }

    // Verificar conflicto de horario si se está cambiando la fecha/hora o profesional
    if (value.fecha_hora || value.profesional_id) {
      const profesionalId = value.profesional_id || (await pool.query('SELECT profesional_id FROM turnos WHERE id = $1', [id])).rows[0].profesional_id;
      const fechaHora = value.fecha_hora || (await pool.query('SELECT fecha_hora FROM turnos WHERE id = $1', [id])).rows[0].fecha_hora;

      const conflictoResult = await pool.query(
        `SELECT id FROM turnos 
         WHERE profesional_id = $1 
         AND fecha_hora = $2 
         AND id != $3
         AND estado NOT IN ('Cancelado', 'No asistió')
         AND establecimiento_id = $4`,
        [profesionalId, fechaHora, id, req.user.establecimiento_id]
      );

      if (conflictoResult.rows.length > 0) {
        return res.status(409).json({
          error: 'El profesional ya tiene un turno en ese horario',
          code: 'SCHEDULE_CONFLICT'
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
      `UPDATE turnos SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, especialidad, fecha_hora, estado, observaciones, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Turno actualizado exitosamente',
      turno: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/turnos/:id - Eliminar turno
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('turnos'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que no hay prácticas asociadas
    const practicasResult = await pool.query(
      'SELECT id FROM practicas WHERE turno_id = $1',
      [id]
    );

    if (practicasResult.rows.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el turno porque tiene prácticas asociadas',
        code: 'TURNO_HAS_PRACTICES'
      });
    }

    const result = await pool.query(
      'DELETE FROM turnos WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Turno no encontrado',
        code: 'TURNO_NOT_FOUND'
      });
    }

    res.json({
      message: 'Turno eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
