/**
 * Configurações da aplicação centralizadas.
 * Todas as variáveis de ambiente são acessadas através deste módulo.
 * 
 * @example
 * import { config } from '../config/env';
 * console.log(config.API_BASE_URL);
 */

interface AppConfig {
    /** URL base da API backend (sem /api) */
    API_BASE_URL: string;
    /** URL completa da API (com /api) */
    API_URL: string;
    /** Chave da API do TinyMCE */
    TINYMCE_API_KEY: string;
    /** Ambiente atual */
    IS_PRODUCTION: boolean;
}

/**
 * Valida se uma variável de ambiente está definida.
 * Em produção, lança erro se faltar variável obrigatória.
 */
function getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key] ?? defaultValue;

    if (value === undefined || value === '') {
        console.warn(`⚠️ Variável de ambiente ${key} não definida`);
        return defaultValue ?? '';
    }

    return value;
}

export const config: AppConfig = {
    API_BASE_URL: getEnvVar('VITE_API_BASE_URL', ''),
    API_URL: `${getEnvVar('VITE_API_BASE_URL', '')}/api`,
    TINYMCE_API_KEY: getEnvVar('VITE_TINYMCE_API_KEY', ''),
    IS_PRODUCTION: import.meta.env.PROD,
};

/**
 * Gera URL completa para assets do servidor (ex: imagens)
 */
export function getAssetUrl(path: string): string {
    if (!path) return '';
    // Se já é URL absoluta, retorna como está
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Concatena com base URL
    return `${config.API_BASE_URL}${path}`;
}
