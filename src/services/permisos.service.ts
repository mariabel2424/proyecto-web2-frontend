import { apiClient } from '@/lib/api/client';

export interface Permiso {
  id_permiso: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  modulo: string;
}

export const permisosService = {
  async getAll(params?: { modulo?: string; per_page?: number }) {
    try {
      const { data } = await apiClient.get<Permiso[] | { data: Permiso[] }>(
        '/permisos',
        params,
      );
      // Manejar respuesta paginada o array directo
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error obteniendo permisos:', error);
      return [];
    }
  },

  async getModulos() {
    try {
      const { data } = await apiClient.get<string[]>('/permisos/modulos');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error obteniendo módulos:', error);
      return [];
    }
  },

  async create(permiso: Omit<Permiso, 'id_permiso' | 'slug'>) {
    const { data } = await apiClient.post<{ data: Permiso }>(
      '/permisos',
      permiso,
    );
    return data.data;
  },

  async update(
    id: number,
    permiso: Partial<Omit<Permiso, 'id_permiso' | 'slug'>>,
  ) {
    const { data } = await apiClient.put<{ data: Permiso }>(
      `/permisos/${id}`,
      permiso,
    );
    return data.data;
  },

  async delete(id: number) {
    await apiClient.delete(`/permisos/${id}`);
  },
};
