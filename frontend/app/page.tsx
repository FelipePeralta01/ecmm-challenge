'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../lib/api';
import ProductFilters from '../components/ProductFilters';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { Plus, Package } from 'lucide-react';

export default function CatalogPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', { search: debouncedSearch, category: selectedCategory }],
    queryFn: () =>
      getProducts({
        search: debouncedSearch,
        category: selectedCategory,
      }),
  });

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedCategory('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Package className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Inventario</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explora el Catálogo
          </h2>
          <p className="text-sm text-slate-500">
            Administra, filtra y agrega artículos a la base de datos de productos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <ProductFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onReset={handleClearFilters}
      />

      <ProductList
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        onClearFilters={handleClearFilters}
      />

      <ProductForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}