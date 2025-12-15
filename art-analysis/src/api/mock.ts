import type { IArtExpert, DraftTaskInfo } from '../types/types';

// Mock-данные (для разработки без бэкенда)
export const MOCK_ART_EXPERTS: IArtExpert[] = [
  {
    id_artcenter: 1,
    title: "Анализ композиционного центра картины",
    description:
      "Определение ключевой точки композиции, выявление фокуса и направления взгляда.",
    status: true,
    img_url: "/ArtFront/images/abstract_1.jpg",
    algorithm: "Визуальный анализ изображения",
    name: "Петр Иванов",
  },
  {
    id_artcenter: 2,
    title: "Цветовой анализ произведений",
    description:
      "Комплексное исследование цветовой структуры художественных произведений. Анализ выявляет доминирующие цветовые палитры, контрасты и гармонические сочетания. Включает определение основных цветовых схем, распределение теплых и холодных тонов, оценку визуального воздействия цветовых комбинаций. Позволяет раскрыть художественный замысел через анализ цветовой выразительности.",
    status: true,
    img_url: "/ArtFront/images/abstract_2.jpg",
    algorithm: "Анализ цветовой гармонии изображения",
    name: "Анна Смирнова",
  },
  {
    id_artcenter: 3,
    title: "Оценка композиции фотографий",
    description:
      "Выявление сильных и слабых сторон композиции фотографии, рекомендации по улучшению.",
    status: true,
    img_url: "/ArtFront/images/abstract_3.jpg",
    algorithm: "Цифровой анализ",
    name: "Иван Петров",
  },
];


export const getMockArtExpertById = (id: string): IArtExpert | null => {
  return MOCK_ART_EXPERTS.find(expert => expert.id_artcenter === Number(id)) || null;
};


export const getMockArtExperts = (title?: string): IArtExpert[] => {
    if (!title) return MOCK_ART_EXPERTS;

    return MOCK_ART_EXPERTS.filter(expert =>
        expert.title.toLowerCase().includes(title.toLowerCase())
    );
};


export const mockDraftTask: DraftTaskInfo = {
    id_request: 1,
    experts_count: 0,
};