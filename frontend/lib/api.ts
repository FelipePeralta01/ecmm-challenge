import { Category, Product, CreateProductPayload, ApiValidationError } from '../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  data?: ApiValidationError;
  status?: number;

  constructor(message: string, data?: ApiValidationError, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.data = data;
    this.status = status;
  }
}

export async function getProducts(filters: { search?: string; category?: string | number } = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    params.append('search', filters.search.trim());
  }
  if (filters.category !== undefined && filters.category !== null && String(filters.category) !== '') {
    params.append('category', String(filters.category));
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/products/${query}`);

  if (!response.ok) {
    throw new ApiError(`Error ${response.status}: ${response.statusText}`, undefined, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`);

  if (!response.ok) {
    throw new ApiError(`Error ${response.status}: ${response.statusText}`, undefined, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError('Error al crear el producto', data, response.status);
  }

  return data;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new ApiError(`Error al eliminar el producto`, undefined, response.status);
  }

  return true;
}
