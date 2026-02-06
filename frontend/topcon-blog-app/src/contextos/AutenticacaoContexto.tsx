import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { autenticacaoServico } from '../servicos/api';
import type { UsuarioDto, LoginDto, RegistroDto } from '../servicos/api';

interface ContextoAutenticacao {
    usuario: UsuarioDto | null;
    token: string | null;
    carregando: boolean;
    estaAutenticado: boolean;
    ehAdmin: boolean;
    login: (dados: LoginDto) => Promise<{ sucesso: boolean; mensagem: string }>;
    registrar: (dados: RegistroDto) => Promise<{ sucesso: boolean; mensagem: string }>;
    logout: () => void;
}

const AuthContext = createContext<ContextoAutenticacao | undefined>(undefined);

interface ProvedorAutenticacaoProps {
    children: ReactNode;
}

export function ProvedorAutenticacao({ children }: ProvedorAutenticacaoProps) {
    const [usuario, setUsuario] = useState<UsuarioDto | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    // Carregar dados do localStorage ao iniciar
    useEffect(() => {
        const tokenSalvo = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');

        if (tokenSalvo && usuarioSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setCarregando(false);
    }, []);

    const estaAutenticado = !!token && !!usuario;
    const ehAdmin = usuario?.grupoNome === 'admin';

    const login = async (dados: LoginDto) => {
        try {
            const resposta = await autenticacaoServico.login(dados);

            if (resposta.sucesso && resposta.token && resposta.usuario) {
                localStorage.setItem('token', resposta.token);
                localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
                setToken(resposta.token);
                setUsuario(resposta.usuario);
                return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
            }

            return { sucesso: false, mensagem: resposta.mensagem || 'Erro ao fazer login' };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { mensagem?: string } } };
            return {
                sucesso: false,
                mensagem: err.response?.data?.mensagem || 'Erro ao conectar com o servidor'
            };
        }
    };

    const registrar = async (dados: RegistroDto) => {
        try {
            const resposta = await autenticacaoServico.registrar(dados);

            if (resposta.sucesso && resposta.token && resposta.usuario) {
                localStorage.setItem('token', resposta.token);
                localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
                setToken(resposta.token);
                setUsuario(resposta.usuario);
                return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
            }

            return { sucesso: false, mensagem: resposta.mensagem || 'Erro ao cadastrar' };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { mensagem?: string } } };
            return {
                sucesso: false,
                mensagem: err.response?.data?.mensagem || 'Erro ao conectar com o servidor'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                carregando,
                estaAutenticado,
                ehAdmin,
                login,
                registrar,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAutenticacao() {
    const contexto = useContext(AuthContext);
    if (contexto === undefined) {
        throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
    }
    return contexto;
}
