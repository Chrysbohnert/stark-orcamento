import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Classe para operações do banco de dados
class DatabaseService {
  // ===== USUÁRIOS =====
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data || [];
  }

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ===== GUINDASTES =====
  async getGuindastes() {
    const { data, error } = await supabase
      .from('guindastes')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  }

  async createGuindaste(guindasteData) {
    const { data, error } = await supabase
      .from('guindastes')
      .insert([guindasteData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateGuindaste(id, guindasteData) {
    const { data, error } = await supabase
      .from('guindastes')
      .update(guindasteData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteGuindaste(id) {
    const { error } = await supabase
      .from('guindastes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ===== OPCIONAIS =====
  async getOpcionais() {
    const { data, error } = await supabase
      .from('opcionais')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  }

  async createOpcional(opcionalData) {
    const { data, error } = await supabase
      .from('opcionais')
      .insert([opcionalData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOpcional(id, opcionalData) {
    const { data, error } = await supabase
      .from('opcionais')
      .update(opcionalData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getOpcionaisDoGuindaste(guindasteId) {
    const { data, error } = await supabase
      .from('guindaste_opcionais')
      .select(`
        opcional_id,
        opcional:opcionais(*)
      `)
      .eq('guindaste_id', guindasteId);
    
    if (error) throw error;
    return data?.map(item => item.opcional).filter(opcional => opcional && opcional.ativo) || [];
  }

  async salvarOpcionaisDoGuindaste(guindasteId, opcionais) {
    // Primeiro, remove todos os opcionais existentes deste guindaste
    await supabase
      .from('guindaste_opcionais')
      .delete()
      .eq('guindaste_id', guindasteId);
    
    // Depois, adiciona os novos opcionais
    if (opcionais && opcionais.length > 0) {
      const opcionaisData = opcionais.map(opcional => ({
        guindaste_id: guindasteId,
        opcional_id: opcional.id
      }));
      
      const { error } = await supabase
        .from('guindaste_opcionais')
        .insert(opcionaisData);
      
      if (error) throw error;
    }
  }

  // ===== CLIENTES =====
  async getClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data || [];
  }

  async createCliente(clienteData) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([clienteData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== CAMINHÕES =====
  async getCaminhoes() {
    const { data, error } = await supabase
      .from('caminhoes')
      .select('*')
      .order('placa');
    
    if (error) throw error;
    return data || [];
  }

  async createCaminhao(caminhaoData) {
    const { data, error } = await supabase
      .from('caminhoes')
      .insert([caminhaoData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== PEDIDOS =====
  async getPedidos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        vendedor:users(*),
        caminhao:caminhoes(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createPedido(pedidoData) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([pedidoData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePedido(id, pedidoData) {
    const { data, error } = await supabase
      .from('pedidos')
      .update(pedidoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ===== ITENS DO PEDIDO =====
  async createPedidoItem(itemData) {
    const { data, error } = await supabase
      .from('pedido_itens')
      .insert([itemData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPedidoItens(pedidoId) {
    const { data, error } = await supabase
      .from('pedido_itens')
      .select(`
        *,
        guindaste:guindastes(*),
        opcional:opcionais(*)
      `)
      .eq('pedido_id', pedidoId);
    
    if (error) throw error;
    return data || [];
  }

  // ===== PREÇOS POR REGIÃO =====
  async getPrecoGuindastePorRegiao(guindasteId, regiao) {
    const { data, error } = await supabase
      .from('precos_guindaste_regiao')
      .select('preco')
      .eq('guindaste_id', guindasteId)
      .eq('regiao', regiao)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data ? data.preco : null;
  }

  async getPrecosPorRegiao(guindasteId) {
    const { data, error } = await supabase
      .from('precos_guindaste_regiao')
      .select('*')
      .eq('guindaste_id', guindasteId);
    
    if (error) throw error;
    return data || [];
  }

  async salvarPrecosPorRegiao(guindasteId, precos) {
    // Primeiro, deletar preços existentes para este guindaste
    await supabase
      .from('precos_guindaste_regiao')
      .delete()
      .eq('guindaste_id', guindasteId);

    // Depois, inserir os novos preços
    if (precos && precos.length > 0) {
      const { error } = await supabase
        .from('precos_guindaste_regiao')
        .insert(precos.map(p => ({
          guindaste_id: guindasteId,
          regiao: p.regiao,
          preco: p.preco
        })));
      
      if (error) throw error;
    }
  }
}

// Instância única do serviço
export const db = new DatabaseService(); 