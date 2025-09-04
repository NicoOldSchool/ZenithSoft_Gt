import express from 'express';
import Joi from 'joi';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles, checkEstablecimientoAccess } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const arancelSchema = Joi.object({
  codigo: Joi.string().min(2).max(50).required(),
  nombre: Joi.string().min(2).max(255).required(),
  categoria: Joi.string().max(100).optional(),
  valor: Joi.number().positive().required()
});

const arancelUpdateSchema = Joi.object({
  codigo: Joi.string().min(2).max(50).optional(),
  nombre: Joi.string().min(2).max(255).optional(),
  categoria: Joi.string().max(100).optional(),
  valor: Joi.number().positive().optional(),
  activo: Joi.boolean().optional()
});

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/aranceles - Obtener todos los aranceles del establecimiento
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', categoria = '', activo = '', sortBy = 'nombre', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, codigo, nombre, categoria, valor, activo, created_at, updated_at
      FROM aranceles 
      WHERE establecimiento_id = $1
    `;
    const queryParams = [req.user.establecimiento_id];

    // Agregar filtros
    if (search) {
      query += ` AND (LOWER(nombre) LIKE LOWER($2) OR codigo LIKE $2)`;
      queryParams.push(`%${search}%`);
    }

    if (categoria) {
      query += ` AND LOWER(categoria) LIKE LOWER($${queryParams.length + 1})`;
      queryParams.push(`%${categoria}%`);
    }

    if (activo !== '') {
      query += ` AND activo = $${queryParams.length + 1}`;
      queryParams.push(activo === 'true');
    }

    // Agregar ordenamiento
    const allowedSortFields = ['nombre', 'codigo', 'categoria', 'valor', 'created_at'];
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
    let countQuery = `SELECT COUNT(*) FROM aranceles WHERE establecimiento_id = $1`;
    const countParams = [req.user.establecimiento_id];
    let countParamIndex = 2;

    if (search) {
      countQuery += ` AND (LOWER(nombre) LIKE LOWER($${countParamIndex}) OR codigo LIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (categoria) {
      countQuery += ` AND LOWER(categoria) LIKE LOWER($${countParamIndex})`;
      countParams.push(`%${categoria}%`);
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
      aranceles: result.rows,
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

// GET /api/aranceles/:id - Obtener un arancel específico
router.get('/:id', checkEstablecimientoAccess('aranceles'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, codigo, nombre, categoria, valor, activo, created_at, updated_at FROM aranceles WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Arancel no encontrado',
        code: 'ARANCEL_NOT_FOUND'
      });
    }

    res.json({
      arancel: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/aranceles - Crear nuevo arancel
router.post('/', authorizeRoles('Administrador'), async (req, res, next) => {
  try {
    const { error, value } = arancelSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { codigo, nombre, categoria, valor } = value;

    // Verificar que el código no existe en el establecimiento
    const existingArancel = await pool.query(
      'SELECT id FROM aranceles WHERE codigo = $1 AND establecimiento_id = $2',
      [codigo, req.user.establecimiento_id]
    );

    if (existingArancel.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe un arancel con ese código',
        code: 'CODIGO_ALREADY_EXISTS'
      });
    }

    const result = await pool.query(
      `INSERT INTO aranceles (codigo, nombre, categoria, valor, establecimiento_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, codigo, nombre, categoria, valor, activo, created_at, updated_at`,
      [codigo, nombre, categoria, valor, req.user.establecimiento_id]
    );

    res.status(201).json({
      message: 'Arancel creado exitosamente',
      arancel: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/aranceles/:id - Actualizar arancel
router.put('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('aranceles'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = arancelUpdateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Verificar que el arancel existe
    const existingArancel = await pool.query(
      'SELECT id FROM aranceles WHERE id = $1 AND establecimiento_id = $2',
      [id, req.user.establecimiento_id]
    );

    if (existingArancel.rows.length === 0) {
      return res.status(404).json({
        error: 'Arancel no encontrado',
        code: 'ARANCEL_NOT_FOUND'
      });
    }

    // Si se está actualizando el código, verificar que no exista otro arancel con ese código
    if (value.codigo) {
      const codigoExists = await pool.query(
        'SELECT id FROM aranceles WHERE codigo = $1 AND establecimiento_id = $2 AND id != $3',
        [value.codigo, req.user.establecimiento_id, id]
      );

      if (codigoExists.rows.length > 0) {
        return res.status(409).json({
          error: 'Ya existe otro arancel con ese código',
          code: 'CODIGO_ALREADY_EXISTS'
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
      `UPDATE aranceles SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND establecimiento_id = $${paramIndex + 1} 
       RETURNING id, codigo, nombre, categoria, valor, activo, created_at, updated_at`,
      [...updateValues, req.user.establecimiento_id]
    );

    res.json({
      message: 'Arancel actualizado exitosamente',
      arancel: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/aranceles/:id - Eliminar arancel
router.delete('/:id', authorizeRoles('Administrador'), checkEstablecimientoAccess('aranceles'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM aranceles WHERE id = $1 AND establecimiento_id = $2 RETURNING id',
      [id, req.user.establecimiento_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Arancel no encontrado',
        code: 'ARANCEL_NOT_FOUND'
      });
    }

    res.json({
      message: 'Arancel eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
