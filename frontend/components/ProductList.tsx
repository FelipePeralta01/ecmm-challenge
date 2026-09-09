'use client';

import ProductCard from './ProductCard';
import { Product } from '../types/product';
import { PackageSearch, AlertTriangle, RefreshCw } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export default function ProductList({
  products = [],
  isLoading,
  isError,
  error,
  onRetry,
  onClearFilters,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse flex flex-col justify-between h-56"
          >
            <div>
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="h-6 bg-slate-200 rounded w-16"></div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center my-6">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-red-800 mb-1">
          No se pudieron cargar los productos
        </h3>
        <p className="text-sm text-red-600 mb-4">
          {error?.message || 'Ocurrió un error inesperado al consultar la API.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center my-6">
        <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          No se encontraron productos
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
          No hay artículos que coincidan con los filtros aplicados o aún no se han registrado productos.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition"
          >
            Limpiar filtros de búsqueda
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-slate-500">
          Mostrando <span className="font-semibold text-slate-700">{products.length}</span>{' '}
          {products.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}