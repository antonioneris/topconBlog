import axios from 'axios';

// Criação da instância do Axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - redirecionar para login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// Serviços de Autenticação
// =============================================================================

export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegistroDto {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioDto {
  id: number;
  nome: string;
  email: string;
  grupoId: number;
  grupoNome: string;
  dataCriacao: string;
  ativo: boolean;
}

export interface RespostaAutenticacao {
  sucesso: boolean;
  mensagem: string;
  token?: string;
  usuario?: UsuarioDto;
}

export const autenticacaoServico = {
  login: async (dados: LoginDto): Promise<RespostaAutenticacao> => {
    const response = await api.post<RespostaAutenticacao>('/autenticacao/login', dados);
    return response.data;
  },

  registrar: async (dados: RegistroDto): Promise<RespostaAutenticacao> => {
    const response = await api.post<RespostaAutenticacao>('/autenticacao/registrar', dados);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/autenticacao/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },
};

// =============================================================================
// Serviços de Postagens
// =============================================================================

export interface PostagemDto {
  id: number;
  titulo: string;
  conteudo: string;
  autorId: number;
  autorNome: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface CriarPostagemDto {
  titulo: string;
  conteudo: string;
}

export interface PostagensPaginadas {
  postagens: PostagemDto[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
}

export const postagemServico = {
  listar: async (pagina = 1, tamanho = 10): Promise<PostagensPaginadas> => {
    const response = await api.get<PostagensPaginadas>('/postagens', {
      params: { pagina, tamanho },
    });
    return response.data;
  },

  obterPorId: async (id: number): Promise<PostagemDto> => {
    const response = await api.get<PostagemDto>(`/postagens/${id}`);
    return response.data;
  },

  criar: async (dados: CriarPostagemDto): Promise<PostagemDto> => {
    const response = await api.post<PostagemDto>('/postagens', dados);
    return response.data;
  },

  atualizar: async (id: number, dados: CriarPostagemDto): Promise<PostagemDto> => {
    const response = await api.put<PostagemDto>(`/postagens/${id}`, dados);
    return response.data;
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/postagens/${id}`);
  },
};

// =============================================================================
// Serviços de Usuários (Admin)
// =============================================================================

export interface CriarUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  grupoId: number;
}

export interface AtualizarUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  grupoId?: number;
  ativo?: boolean;
}

export interface GrupoDto {
  id: number;
  nome: string;
  descricao?: string;
}

export const usuarioServico = {
  listar: async (): Promise<UsuarioDto[]> => {
    const response = await api.get<UsuarioDto[]>('/usuarios');
    return response.data;
  },

  obterPorId: async (id: number): Promise<UsuarioDto> => {
    const response = await api.get<UsuarioDto>(`/usuarios/${id}`);
    return response.data;
  },

  criar: async (dados: CriarUsuarioDto): Promise<UsuarioDto> => {
    const response = await api.post<UsuarioDto>('/usuarios', dados);
    return response.data;
  },

  atualizar: async (id: number, dados: AtualizarUsuarioDto): Promise<UsuarioDto> => {
    const response = await api.put<UsuarioDto>(`/usuarios/${id}`, dados);
    return response.data;
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  listarGrupos: async (): Promise<GrupoDto[]> => {
    const response = await api.get<GrupoDto[]>('/usuarios/grupos');
    return response.data;
  },
};

export default api;
