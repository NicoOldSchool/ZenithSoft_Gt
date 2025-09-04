export const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
    method: req.method
  });
};
