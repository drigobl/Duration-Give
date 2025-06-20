import { DataProvider, GetListParams, GetOneParams, GetManyParams, GetManyReferenceParams, CreateParams, UpdateParams, UpdateManyParams, DeleteParams, DeleteManyParams } from 'react-admin';
import { supabase } from '../supabase';

const mapOperator = (operator: string): string => {
  switch (operator) {
    case 'ilike':
      return 'ilike';
    case 'like':
      return 'like';
    case 'eq':
      return 'eq';
    case 'ne':
      return 'neq';
    case 'gt':
      return 'gt';
    case 'gte':
      return 'gte';
    case 'lt':
      return 'lt';
    case 'lte':
      return 'lte';
    case 'in':
      return 'in';
    default:
      return 'eq';
  }
};

export const supabaseDataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    let query = supabase.from(resource).select('*', { count: 'exact' });

    // Apply filters
    Object.keys(filter).forEach(key => {
      if (filter[key] !== undefined && filter[key] !== '') {
        if (key.includes('_')) {
          const [fieldName, operator] = key.split('_');
          query = query.filter(fieldName, mapOperator(operator), filter[key]);
        } else {
          query = query.filter(key, 'eq', filter[key]);
        }
      }
    });

    // Apply sorting
    query = query.order(field, { ascending: order === 'ASC' });

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
      total: count || 0,
    };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .in('id', params.ids);

    if (error) {
      throw new Error(error.message);
    }

    return { data: data || [] };
  },

  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    let query = supabase
      .from(resource)
      .select('*', { count: 'exact' })
      .eq(params.target, params.id);

    // Apply additional filters
    Object.keys(filter).forEach(key => {
      if (filter[key] !== undefined && filter[key] !== '') {
        query = query.filter(key, 'eq', filter[key]);
      }
    });

    // Apply sorting
    query = query.order(field, { ascending: order === 'ASC' });

    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
      total: count || 0,
    };
  },

  create: async (resource: string, params: CreateParams) => {
    const { data, error } = await supabase
      .from(resource)
      .insert(params.data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  },

  update: async (resource: string, params: UpdateParams) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  },

  updateMany: async (resource: string, params: UpdateManyParams) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .in('id', params.ids)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { data: params.ids };
  },

  delete: async (resource: string, params: DeleteParams) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data: params.previousData || data };
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    const { error } = await supabase
      .from(resource)
      .delete()
      .in('id', params.ids);

    if (error) {
      throw new Error(error.message);
    }

    return { data: params.ids };
  },
};