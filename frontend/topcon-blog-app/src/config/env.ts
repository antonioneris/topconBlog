interface AppConfig {

    API_BASE_URL: string;
    API_URL: string;
    TINYMCE_API_KEY: string;
    IS_PRODUCTION: boolean;
}


function getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key] ?? defaultValue;

    if (value === undefined || value === '') {
        console.warn(`Variável de ambiente ${key} não definida`);
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

export function getAssetUrl(path: string): string {
    if (!path) return '';
    // Se já é URL absoluta, retorna como está
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Concatena com base URL
    return `${config.API_BASE_URL}${path}`;
}
