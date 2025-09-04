export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      code: 'VALIDATION_ERROR',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Error de base de datos
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'El recurso ya existe',
      code: 'DUPLICATE_RESOURCE',
      field: err.detail?.match(/Key \((.+)\)=/)?.[1] || 'unknown'
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Referencia inválida',
      code: 'FOREIGN_KEY_VIOLATION',
      detail: err.detail
    });
  }

  if (err.code === '23502') { // Not null violation
    return res.status(400).json({
      error: 'Campo requerido faltante',
      code: 'NULL_VIOLATION',
      field: err.column
    });
  }

  // Error personalizado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code || 'CUSTOM_ERROR'
    });
  }

  // Error por defecto
  res.status(500).json({
    error: 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
