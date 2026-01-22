'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { rolesService } from '@/services/usuarios.service';
import { permisosService, type Permiso } from '@/services/permisos.service';
import { Button, ConfirmModal } from '@/components/ui';
import type { Rol } from '@/types';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [modulos, setModulos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] as number[],
  });

  useEffect(() => {
    loadData();
    loadPermisos();
  }, []);

  const loadData = async () => {
    try {
      const rolesData = await rolesService.getAll();
      console.log('Roles cargados:', rolesData);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPermisos = async () => {
    try {
      const [permisosData, modulosData] = await Promise.all([
        permisosService.getAll({ per_page: 200 }),
        permisosService.getModulos(),
      ]);
      setPermisos(permisosData);
      setModulos(modulosData);
    } catch (error) {
      console.error('Error cargando permisos:', error);
      setPermisos([]);
      setModulos([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingRol) {
        await rolesService.update(editingRol.id_rol, formData);
      } else {
        await rolesService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error guardando rol:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (rol: Rol) => {
    setEditingRol(rol);
    setFormData({
      nombre: rol.nombre,
      descripcion: rol.descripcion || '',
      permisos: rol.permisos?.map((p) => p.id_permiso) || [],
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await rolesService.delete(deleteId);
      loadData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setEditingRol(null);
    setFormData({ nombre: '', descripcion: '', permisos: [] });
  };

  const togglePermiso = (permisoId: number) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permisoId)
        ? prev.permisos.filter((id) => id !== permisoId)
        : [...prev.permisos, permisoId],
    }));
  };

  const toggleModulo = (modulo: string) => {
    const permisosDelModulo = permisos
      .filter((p) => p.modulo === modulo)
      .map((p) => p.id_permiso);

    const todosSeleccionados = permisosDelModulo.every((id) =>
      formData.permisos.includes(id),
    );

    if (todosSeleccionados) {
      setFormData((prev) => ({
        ...prev,
        permisos: prev.permisos.filter((id) => !permisosDelModulo.includes(id)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permisos: [...new Set([...prev.permisos, ...permisosDelModulo])],
      }));
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Roles</h1>
              <p className="text-xs text-gray-500">{roles.length} registros</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((rol) => (
            <div
              key={rol.id_rol}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {rol.nombre}
                    </h3>
                    {rol.permisos && rol.permisos.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {rol.permisos.length} permiso
                        {rol.permisos.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {rol.descripcion && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {rol.descripcion}
                </p>
              )}
              {rol.permisos && rol.permisos.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {rol.permisos.slice(0, 3).map((permiso) => (
                      <span
                        key={permiso.id_permiso}
                        className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded"
                      >
                        {permiso.nombre}
                      </span>
                    ))}
                    {rol.permisos.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        +{rol.permisos.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-1 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(rol)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(rol.id_rol)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingRol ? 'Editar' : 'Nuevo'} Rol
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    rows={2}
                  />
                </div>

                {/* Sección de permisos */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Permisos ({formData.permisos.length} seleccionados)
                  </label>
                  <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                    {modulos.map((modulo) => {
                      const permisosDelModulo = permisos.filter(
                        (p) => p.modulo === modulo,
                      );
                      const todosSeleccionados = permisosDelModulo.every((p) =>
                        formData.permisos.includes(p.id_permiso),
                      );

                      return (
                        <div
                          key={modulo}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <button
                            type="button"
                            onClick={() => toggleModulo(modulo)}
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {modulo}
                            </span>
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                todosSeleccionados
                                  ? 'bg-green-600 border-green-600'
                                  : 'border-gray-300'
                              }`}
                            >
                              {todosSeleccionados && (
                                <CheckIcon className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </button>
                          <div className="px-6 pb-2 space-y-1">
                            {permisosDelModulo.map((permiso) => (
                              <label
                                key={permiso.id_permiso}
                                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.permisos.includes(
                                    permiso.id_permiso,
                                  )}
                                  onChange={() =>
                                    togglePermiso(permiso.id_permiso)
                                  }
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <div className="flex-1">
                                  <span className="text-xs text-gray-700">
                                    {permiso.nombre}
                                  </span>
                                  {permiso.descripcion && (
                                    <p className="text-xs text-gray-400">
                                      {permiso.descripcion}
                                    </p>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" disabled={isSaving}>
                    {isSaving
                      ? 'Guardando...'
                      : editingRol
                        ? 'Actualizar'
                        : 'Crear'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="¿Eliminar rol?"
          message="Esta acción no se puede deshacer."
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
