'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import {
  Card,
  Button,
  Alert,
  Spinner,
  Select,
  Pagination,
} from '@/components/ui';
import { cursosService, inscripcionesService } from '@/services/cursos.service';
import { deportistasService } from '@/services/deportistas.service';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import type { Curso, GrupoCurso, Deportista } from '@/types';
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary';

type Step = 'participante' | 'curso' | 'pago' | 'confirmacion';

function InscribirContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('participante');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [participantes, setParticipantes] = useState<Deportista[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [grupos, setGrupos] = useState<GrupoCurso[]>([]);
  const [loadingGrupos, setLoadingGrupos] = useState(false);

  // Paginación y filtros para cursos
  const [cursoPage, setCursoPage] = useState(1);
  const [cursoSearch, setCursoSearch] = useState('');
  const cursosPerPage = 6;

  // Paginación para grupos
  const [grupoPage, setGrupoPage] = useState(1);
  const gruposPerPage = 4;

  const [selectedParticipante, setSelectedParticipante] = useState<
    number | null
  >(null);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null);
  const [selectedGrupo, setSelectedGrupo] = useState<number | null>(null);
  const [pagoData, setPagoData] = useState({
    metodo_pago: 'transferencia',
    referencia: '',
    observaciones: '',
  });

  // Estados para el comprobante
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string>('');
  const [uploadingComprobante, setUploadingComprobante] = useState(false);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const formatTime = (t: string) => {
    if (!t) return '';
    const [hr, min] = t.split(':');
    const h = parseInt(hr);
    return `${h % 12 || 12}:${min} ${h >= 12 ? 'PM' : 'AM'}`;
  };
  const getDias = (dias: string[] | number[] | string | undefined) => {
    if (!dias) return 'Por definir';

    // Si es un string, intentar parsearlo como JSON
    let diasArray: (string | number)[] = [];
    if (typeof dias === 'string') {
      try {
        diasArray = JSON.parse(dias);
      } catch {
        // Si no es JSON válido, dividir por comas
        diasArray = dias.split(',').map((d) => d.trim());
      }
    } else if (Array.isArray(dias)) {
      diasArray = dias;
    } else {
      return 'Por definir';
    }

    if (!diasArray.length) return 'Por definir';

    const map: Record<string, string> = {
      '0': 'Dom',
      '1': 'Lun',
      '2': 'Mar',
      '3': 'Mié',
      '4': 'Jue',
      '5': 'Vie',
      '6': 'Sáb',
    };
    return diasArray.map((d) => map[String(d)] || String(d)).join(', ');
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [partData, cursosData] = await Promise.all([
        deportistasService.getMisParticipantes(),
        cursosService.getCursosAbiertos(),
      ]);
      setParticipantes(Array.isArray(partData) ? partData : []);
      setCursos(cursosData || []);

      const cursoParam = searchParams.get('curso');
      if (cursoParam) {
        const cursoId = parseInt(cursoParam);
        setSelectedCurso(cursoId);
        const gruposData = await cursosService.getGruposPublico(cursoId);
        setGrupos(gruposData || []);
        const grupoParam = searchParams.get('grupo');
        if (grupoParam) setSelectedGrupo(parseInt(grupoParam));
      }
    } catch {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCursoSelect = async (cursoId: number) => {
    setSelectedCurso(cursoId);
    setSelectedGrupo(null);
    setGrupoPage(1);
    setLoadingGrupos(true);
    try {
      const gruposData = await cursosService.getGruposPublico(cursoId);
      setGrupos(gruposData || []);
    } catch {
      setGrupos([]);
    } finally {
      setLoadingGrupos(false);
    }
  };

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      return;
    }

    setComprobante(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprobantePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedParticipante || !selectedCurso || !selectedGrupo) {
      setError('Completa todos los campos');
      return;
    }

    // Validar que haya comprobante para transferencia o efectivo
    if (
      (pagoData.metodo_pago === 'transferencia' ||
        pagoData.metodo_pago === 'efectivo') &&
      !comprobante
    ) {
      setError('Debes subir un comprobante de pago');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let comprobanteUrl = '';

      // Subir comprobante a Cloudinary si existe
      if (comprobante) {
        setUploadingComprobante(true);
        const uploadResult = await uploadToCloudinary(
          comprobante,
          'comprobantes',
        );
        comprobanteUrl = uploadResult.secure_url;
        setUploadingComprobante(false);
      }

      // Crear inscripción con URL del comprobante
      await inscripcionesService.create({
        id_curso: selectedCurso,
        id_grupo: selectedGrupo,
        id_deportista: selectedParticipante,
        generar_factura: true,
        observaciones: `${pagoData.observaciones || ''} - Método: ${pagoData.metodo_pago} - Ref: ${pagoData.referencia || 'N/A'}${comprobanteUrl ? ` - Comprobante: ${comprobanteUrl}` : ''}`,
      });

      setSuccess(
        '¡Inscripción realizada! El administrador verificará tu pago.',
      );
      setStep('confirmacion');
    } catch (err: any) {
      setError(err.message || 'Error al inscribir');
    } finally {
      setSubmitting(false);
      setUploadingComprobante(false);
    }
  };

  // Filtrar y paginar cursos
  const cursosFiltrados = cursos.filter((c) => {
    return c.nombre.toLowerCase().includes(cursoSearch.toLowerCase());
  });
  const totalCursoPages = Math.ceil(cursosFiltrados.length / cursosPerPage);
  const cursosPaginados = cursosFiltrados.slice(
    (cursoPage - 1) * cursosPerPage,
    cursoPage * cursosPerPage,
  );

  // Paginar grupos
  const totalGrupoPages = Math.ceil(grupos.length / gruposPerPage);
  const gruposPaginados = grupos.slice(
    (grupoPage - 1) * gruposPerPage,
    grupoPage * gruposPerPage,
  );

  // Obtener datos seleccionados
  const partSel = participantes.find(
    (p) => p.id_deportista === selectedParticipante,
  );
  const cursoSel = cursos.find((c) => c.id_curso === selectedCurso);
  const grupoSel = grupos.find((g) => g.id_grupo === selectedGrupo);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <AcademicCapIcon className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Inscribir en Curso</h1>
            <p className="text-xs text-gray-500">
              Inscribe a tu hijo en un curso vacacional
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Steps */}
        <div className="flex items-center justify-between px-2">
          {(['participante', 'curso', 'pago', 'confirmacion'] as Step[]).map(
            (s, i) => {
              const labels = ['Participante', 'Curso', 'Pago', 'Confirmación'];
              const isActive = s === step;
              const isDone =
                (s === 'participante' && selectedParticipante) ||
                (s === 'curso' && selectedGrupo) ||
                (s === 'pago' && step === 'confirmacion');
              return (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : isDone
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                    }`}
                  >
                    {isDone && !isActive ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isActive ? 'text-green-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {labels[i]}
                  </span>
                  {i < 3 && <div className="w-8 h-0.5 mx-2 bg-gray-200" />}
                </div>
              );
            },
          )}
        </div>

        <Card className="p-6">
          {/* Step 1 */}
          {step === 'participante' && (
            <div className="space-y-4">
              <h2 className="font-medium">¿A quién deseas inscribir?</h2>
              <div className="space-y-2">
                {participantes.map((p) => (
                  <button
                    key={p.id_deportista}
                    onClick={() => setSelectedParticipante(p.id_deportista)}
                    className={`w-full p-4 text-left border rounded-lg ${
                      selectedParticipante === p.id_deportista
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {p.nombres} {p.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">
                          {p.categoria?.nombre || 'Sin categoría'}
                        </p>
                      </div>
                      {selectedParticipante === p.id_deportista && (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep('curso')}
                  disabled={!selectedParticipante}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 'curso' && (
            <div className="space-y-4">
              <h2 className="font-medium">Selecciona el curso y horario</h2>

              {/* Buscador */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar curso..."
                  value={cursoSearch}
                  onChange={(e) => {
                    setCursoSearch(e.target.value);
                    setCursoPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {cursoSearch && (
                  <button
                    onClick={() => setCursoSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Lista de cursos */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : cursosPaginados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {cursoSearch
                    ? 'No se encontraron cursos con ese nombre'
                    : 'No hay cursos disponibles'}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {cursosPaginados.map((c) => (
                      <button
                        key={c.id_curso}
                        onClick={() => handleCursoSelect(c.id_curso)}
                        className={`w-full p-4 text-left border rounded-lg transition-all ${
                          selectedCurso === c.id_curso
                            ? 'border-green-600 bg-green-50 shadow-sm'
                            : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{c.nombre}</p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  c.tipo === 'vacacional'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {c.tipo}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(c.fecha_inicio)} -{' '}
                              {formatDate(c.fecha_fin)}
                            </p>
                            {c.descripcion && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {c.descripcion}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-green-600 text-lg">
                              {formatCurrency(c.precio || 0)}
                            </p>
                            {selectedCurso === c.id_curso && (
                              <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Paginación de cursos */}
                  {totalCursoPages > 1 && (
                    <div className="flex justify-center pt-2">
                      <Pagination
                        page={cursoPage}
                        lastPage={totalCursoPages}
                        total={cursosFiltrados.length}
                        perPage={cursosPerPage}
                        onPageChange={setCursoPage}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Selección de grupo/horario */}
              {selectedCurso && (
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium">
                    Selecciona el horario
                  </label>
                  {loadingGrupos ? (
                    <div className="flex justify-center py-4">
                      <Spinner />
                    </div>
                  ) : grupos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay horarios disponibles para este curso
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {gruposPaginados.map((g) => {
                          const cupos = g.cupo_maximo - (g.cupo_actual || 0);
                          const full = cupos <= 0;
                          return (
                            <button
                              key={g.id_grupo}
                              onClick={() =>
                                !full && setSelectedGrupo(g.id_grupo)
                              }
                              disabled={full}
                              className={`w-full p-3 text-left border rounded-lg transition-all ${
                                full
                                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                  : selectedGrupo === g.id_grupo
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {g.nombre}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {formatTime(g.hora_inicio || '')} -{' '}
                                    {formatTime(g.hora_fin || '')} |{' '}
                                    {getDias(g.dias_semana)}
                                  </p>
                                  {g.instructor && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                      Instructor: {g.instructor.nombre}{' '}
                                      {g.instructor.apellido}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded font-medium ${
                                      full
                                        ? 'bg-red-100 text-red-700'
                                        : cupos <= 5
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-green-100 text-green-700'
                                    }`}
                                  >
                                    {full ? 'Lleno' : `${cupos} cupos`}
                                  </span>
                                  {selectedGrupo === g.id_grupo && (
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Paginación de grupos */}
                      {totalGrupoPages > 1 && (
                        <div className="flex justify-center pt-2">
                          <Pagination
                            page={grupoPage}
                            lastPage={totalGrupoPages}
                            total={grupos.length}
                            perPage={gruposPerPage}
                            onPageChange={setGrupoPage}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep('participante')}
                >
                  Atrás
                </Button>
                <Button
                  onClick={() => setStep('pago')}
                  disabled={!selectedGrupo}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 'pago' && (
            <div className="space-y-4">
              <h2 className="font-medium">Información de Pago</h2>

              {/* Resumen */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participante:</span>
                  <span className="font-medium">
                    {partSel?.nombres} {partSel?.apellidos}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso:</span>
                  <span className="font-medium">{cursoSel?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-medium">{grupoSel?.nombre}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(cursoSel?.precio || 0)}
                  </span>
                </div>
              </div>

              {/* Método de pago */}
              <Select
                label="Método de pago"
                value={pagoData.metodo_pago}
                onChange={(e) => {
                  setPagoData({ ...pagoData, metodo_pago: e.target.value });
                  // Limpiar comprobante si cambia a tarjeta
                  if (e.target.value === 'tarjeta') {
                    setComprobante(null);
                    setComprobantePreview('');
                  }
                }}
                options={[
                  { value: 'transferencia', label: 'Transferencia Bancaria' },
                  { value: 'efectivo', label: 'Efectivo' },
                ]}
              />

              {/* Referencia de pago */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Referencia de pago{' '}
                  {pagoData.metodo_pago === 'transferencia' && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  value={pagoData.referencia}
                  onChange={(e) =>
                    setPagoData({ ...pagoData, referencia: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={
                    pagoData.metodo_pago === 'transferencia'
                      ? 'Número de referencia de la transferencia'
                      : 'Número de recibo (opcional)'
                  }
                />
              </div>

              {/* Comprobante de pago */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comprobante de pago <span className="text-red-500">*</span>
                </label>

                {!comprobantePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleComprobanteChange}
                      className="hidden"
                      id="comprobante-upload"
                    />
                    <label
                      htmlFor="comprobante-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Subir comprobante
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG o WEBP (máx. 5MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={comprobantePreview}
                      alt="Comprobante"
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        setComprobante(null);
                        setComprobantePreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                    <div className="p-2 bg-gray-50 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhotoIcon className="h-4 w-4" />
                        <span className="truncate">{comprobante?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={pagoData.observaciones}
                  onChange={(e) =>
                    setPagoData({ ...pagoData, observaciones: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Información adicional sobre el pago..."
                />
              </div>

              {/* Alerta */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p className="font-medium mb-1">⚠️ Importante:</p>
                <p>
                  Tu inscripción quedará pendiente hasta que el administrador
                  verifique el comprobante de pago. Recibirás una notificación
                  cuando sea aprobada.
                </p>
              </div>

              {/* Botones */}
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep('curso')}>
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={submitting || uploadingComprobante}
                  disabled={!comprobante}
                >
                  {uploadingComprobante
                    ? 'Subiendo comprobante...'
                    : 'Confirmar Inscripción'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 'confirmacion' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                ¡Inscripción Registrada!
              </h2>
              <p className="text-gray-600 mb-6">
                El administrador verificará tu pago y recibirás confirmación.
              </p>
              <div className="p-4 bg-gray-50 rounded-lg text-left text-sm mb-6 max-w-sm mx-auto">
                <p>
                  <span className="text-gray-600">Participante:</span>{' '}
                  {partSel?.nombres} {partSel?.apellidos}
                </p>
                <p>
                  <span className="text-gray-600">Curso:</span>{' '}
                  {cursoSel?.nombre}
                </p>
                <p>
                  <span className="text-gray-600">Grupo:</span>{' '}
                  {grupoSel?.nombre}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/mis-participantes')}
                >
                  Ver Participantes
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function InscribirPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        </DashboardLayout>
      }
    >
      <InscribirContent />
    </Suspense>
  );
}
