export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: number;
  category_details?: Category;
  created_at: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: string;
  stock: number;
  category: number;
}

export interface ApiValidationError {
  [key: string]: string[];
}