'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { authService } from '@/services/auth.service';
import { KeyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CambiarContrasenaPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await authService.cambiarPassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Opcional: cerrar sesión después de cambiar contraseña
      setTimeout(() => {
        // window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      console.error('Error cambiando contraseña:', err);
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <KeyIcon className="h-5 w-5 text-green-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              Cambiar Contraseña
            </h1>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-emerald-700">
                Contraseña actualizada correctamente
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
