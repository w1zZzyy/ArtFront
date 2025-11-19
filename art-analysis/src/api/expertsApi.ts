// src/api/artExpertsApi.ts
import type { IArtExpert } from '../types/types';
import { 
    getMockArtExperts,
    getMockArtExpertById
} from './mock';

// Состояние доступности бэкенда
let isBackendAvailable: boolean | null = null;

// Проверка доступности бэкенда
const checkBackendAvailability = async (): Promise<boolean> => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    
    try {
        const response = await fetch('/health', {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });

        isBackendAvailable = response.ok;
        console.log(`Бэкенд ${isBackendAvailable ? 'доступен' : 'недоступен'}`);
    } catch (error) {
        console.warn('Бэкенд недоступен, используем моковые данные', error);
        isBackendAvailable = false;
    }
    
    return isBackendAvailable;
};

// Обертка с таймаутом
const fetchWithTimeout = async (
    url: string, 
    options: RequestInit = {}, 
    timeout = 5000
): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

//
// ============================
//       API ФУНКЦИИ
// ============================
//

// Получить список экспертов
export const getArtExperts = async (title?: string): Promise<IArtExpert[]> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getArtExperts');
        return getMockArtExperts(title);
    }
    
    try {
        const url = title
            ? `/api/art-experts?title=${encodeURIComponent(title)}`
            : '/api/art-experts';

        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error('Ошибка загрузки экспертов');
        return await res.json();
    } catch (error) {
        console.warn('Ошибка при запросе art-experts, используем моки', error);
        isBackendAvailable = false;
        return getMockArtExperts(title);
    }
};

// Получить эксперта по ID
export const getArtExpertById = async (id: string): Promise<IArtExpert> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getArtExpertById');
        const expert = getMockArtExpertById(id);
        if (expert) return expert;
        throw new Error(`Эксперт с ID "${id}" не найден в моках`);
    }
    
    try {
        const response = await fetchWithTimeout(`/api/art-experts/${id}`);
        if (!response.ok) throw new Error('Expert not found');
        return await response.json();
    } catch (error) {
        console.warn('Ошибка при запросе эксперта по ID, используем моки', error);
        isBackendAvailable = false;

        const expert = getMockArtExpertById(id);
        if (expert) return expert;
        throw new Error(`Эксперт с ID "${id}" не найден`);
    }
};

//
// ============================
//   ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ============================
//

export const forceMockMode = (): void => {
    isBackendAvailable = false;
    console.log('Принудительно включен режим моков');
};

export const forceBackendMode = (): void => {
    isBackendAvailable = true;
    console.log('Принудительно включен режим бэкенда');
};

export const resetBackendCheck = (): void => {
    isBackendAvailable = null;
    console.log('Сброшена проверка доступности бэкенда');
};

export const isUsingMockData = (): boolean => {
    return isBackendAvailable === false;
};

export const getBackendStatus = (): 'checking' | 'available' | 'unavailable' => {
    if (isBackendAvailable === null) return 'checking';
    if (isBackendAvailable === true) return 'available';
    return 'unavailable';
};
