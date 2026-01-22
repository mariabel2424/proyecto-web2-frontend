'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Alert } from '@/components/ui';
import { apiClient } from '@/lib/api/client';

export default function RecuperarPasswordPage() {
  const [step, setStep] = useState<'email' | 'token' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenFromEmail, setTokenFromEmail] = useState('');

  const handleSolicitarReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { data } = await apiClient.post<{
        token?: string;
        message?: string;
      }>('/auth/solicitar-reset', { email });
      setSuccess('Se ha enviado un código de verificación a tu correo');
      setTokenFromEmail(data.token || ''); // Solo para desarrollo
      setStep('token');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al solicitar restablecimiento. Verifica tu correo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess('Contraseña restablecida exitosamente');
      setStep('success');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al restablecer contraseña. Verifica el código.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Imagen de fondo a la izquierda */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/fondo-login.jpg"
          alt="Deportes Montecristi"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 bg-white">
        <div className="w-full max-w-sm p-8">
          {step === 'email' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Recuperar contraseña
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa tu correo para recibir un código de verificación
                </p>
              </div>

              {error && <Alert variant="error">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {tokenFromEmail && (
                <Alert variant="info" className="mb-4">
                  <strong>Código de desarrollo:</strong> {tokenFromEmail}
                  <br />
                  <small>(Este mensaje solo aparece en desarrollo)</small>
                </Alert>
              )}

              <form onSubmit={handleSolicitarReset} className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Enviar código
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                <Link href="/login" className="text-gray-900 hover:underline">
                  Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}

          {step === 'token' && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Restablecer contraseña
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa el código que recibiste en tu correo
                </p>
              </div>

              {error && <Alert variant="error">{error}</Alert>}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  label="Código de verificación"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Ingresa el código"
                  required
                />

                <Input
                  label="Nueva contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />

                <Input
                  label="Confirmar contraseña"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Restablecer contraseña
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                <button
                  onClick={() => setStep('email')}
                  className="text-gray-900 hover:underline"
                >
                  Solicitar nuevo código
                </button>
              </p>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡Contraseña restablecida!
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  Tu contraseña ha sido actualizada exitosamente
                </p>
                <Link href="/login">
                  <Button className="w-full">Iniciar sesión</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
