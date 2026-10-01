import axios from 'axios';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

export function getApiErrorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

export function getApiErrorCode(err: unknown): string | undefined {
  if (!axios.isAxiosError<ApiErrorBody>(err)) return undefined;
  return err.response?.data?.error?.code;
}

export function getApiErrorMessage(err: unknown, fallback = 'Une erreur est survenue. Réessaie.'): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    if (!err.response) return 'Impossible de joindre le serveur. Vérifie ta connexion.';
    return err.response.data?.error?.message ?? fallback;
  }
  return err instanceof Error && err.message ? err.message : fallback;
}
