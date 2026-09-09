'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProduct } from '../lib/api';
import { Product } from '../types/product';
import { Tag, Calendar, Trash2, PackageCheck, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(product.price));

  const formattedDate = new Date(product.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const categoryName = product.category_details?.name || 'General';
  const hasStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Eliminar producto"
            className="text-slate-300 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-semibold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-indigo-600 transition">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 min-h-[2rem]">
          {product.description || 'Sin descripción disponible.'}
        </p>
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block leading-none mb-1">Precio</span>
          <span className="text-lg font-bold text-slate-900 leading-none">
            {formattedPrice}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block leading-none mb-1">Stock</span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              !hasStock
                ? 'bg-red-100 text-red-700'
                : isLowStock
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {!hasStock ? (
              <>
                <AlertCircle className="w-3 h-3" />
                Agotado
              </>
            ) : (
              <>
                <PackageCheck className="w-3 h-3" />
                {product.stock} un.
              </>
            )}
          </span>
        </div>
      </div>

      <div className="px-5 py-1.5 bg-slate-50/50 border-t border-slate-100/80 flex items-center gap-1 text-[11px] text-slate-400">
        <Calendar className="w-3 h-3" />
        <span>Agregado el {formattedDate}</span>
      </div>
    </div>
  );
}
