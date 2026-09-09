'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, getCategories, ApiError } from '../lib/api';
import { ApiValidationError } from '../types/product';
import { X, Plus, Loader2, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductForm({ isOpen, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [serverErrors, setServerErrors] = useState<ApiValidationError>({});

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleClose();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.data) {
        setServerErrors(err.data);
      } else {
        setServerErrors({ general: [(err as Error).message || 'Error al guardar el producto'] });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
    setServerErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});

    const errors: ApiValidationError = {};
    if (!formData.name.trim()) errors.name = ['El nombre es obligatorio.'];
    if (!formData.category) errors.category = ['Debes seleccionar una categoría.'];
    if (formData.price === '' || Number(formData.price) < 0) {
      errors.price = ['El precio debe ser mayor o igual a 0.'];
    }
    if (
      formData.stock === '' ||
      Number(formData.stock) < 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      errors.stock = ['El stock debe ser un número entero mayor o igual a 0.'];
    }

    if (Object.keys(errors).length > 0) {
      setServerErrors(errors);
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price).toFixed(2),
      stock: parseInt(formData.stock, 10),
      category: parseInt(formData.category, 10),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Crear Nuevo Producto</h2>
              <p className="text-xs text-slate-500">Ingresa los datos para agregarlo al catálogo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverErrors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverErrors.general.join(' ')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Teclado Mecánico RGB"
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition ${
                serverErrors.name
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            />
            {serverErrors.name && (
              <p className="mt-1 text-xs text-red-600">{serverErrors.name.join(' ')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoadingCategories}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition cursor-pointer ${
                serverErrors.category
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            >
              <option value="">Selecciona una categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {serverErrors.category && (
              <p className="mt-1 text-xs text-red-600">{serverErrors.category.join(' ')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Precio (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  serverErrors.price
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                    : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
                }`}
              />
              {serverErrors.price && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.price.join(' ')}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock (Unidades) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  serverErrors.stock
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                    : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
                }`}
              />
              {serverErrors.stock && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.stock.join(' ')}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles, especificaciones o características del producto..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition inline-flex items-center gap-2 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
