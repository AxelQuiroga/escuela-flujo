/**
 * Parsea y valida los query params de paginación.
 * Defaults: page=1, limit=10, max limit=100
 */
export const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  return { page, limit };
};

/**
 * Construye la respuesta paginada estándar.
 */
export const buildPaginatedResponse = (data, total, { page, limit }) => ({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});
