// src/api/artExpertsApi.ts
import type { IArtExpert } from '../types/types';
import { 
    getMockArtExperts,
    getMockArtExpertById
} from './mock';

// Базовый URL бэкенда
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Состояние доступности бэкенда
let isBackendAvailable: boolean | null = null;

// Проверка доступности бэкенда
const checkBackendAvailability = async (): Promise<boolean> => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
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

const normalizeExpertData = (data: any): IArtExpert => {
    console.log('Нормализация данных эксперта:', data);
    
    return {
        id_artcenter: data.id_artcenter || data.ID_artcenter || data.IdArtcenter || 0,
        title: data.title || data.Title || '',
        description: data.description || data.Description || '',
        status: data.status !== undefined ? data.status : data.Status || false,
        img_url: data.img_url || data.ImgURL || data.image_url || data.Image || null,
        name: data.name || data.Name || '',
        algorithm: data.algorithm || data.Algorithm || ''
    };
};

// Получить список экспертов
export const getArtExperts = async (title?: string): Promise<IArtExpert[]> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getArtExperts');
        return getMockArtExperts(title);
    }
    
    try {
        const url = title
            ? `${API_BASE_URL}/api/experts?title=${encodeURIComponent(title)}`
            : `${API_BASE_URL}/api/experts`;

        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error('Ошибка загрузки экспертов');
        return await res.json();
    } catch (error) {
        console.warn('Ошибка при запросе experts, используем моки', error);
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
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/experts/${id}`);
        if (!response.ok) throw new Error('Expert not found');
        
        const apiData = await response.json();
        console.log('Эксперт с API по ID:', apiData);
        
        // Преобразуем данные
        const expert = normalizeExpertData(apiData);
        
        console.log('Нормализованный эксперт:', expert);
        return expert;
    } catch (error: unknown) {
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
