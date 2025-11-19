import type { IArtExpert } from '../types/types';

// Mock-данные (для разработки без бэкенда)
export const MOCK_ART_EXPERTS: IArtExpert[] = [
  {
    ID_artcenter: 1,
    Title: "Анализ композиционного центра картины",
    Description:
      "Определение ключевой точки композиции, выявление фокуса и направления взгляда.",
    Status: true,
    Image: "http://localhost:9000/art-center/abstract_1.jpg",
    Algorithm: "Визуальный анализ изображения",
    Name: "Петр Иванов",
  },
  {
    ID_artcenter: 2,
    Title: "Цветовой анализ произведений",
    Description:
      "Комплексное исследование цветовой структуры художественных произведений. Анализ выявляет доминирующие цветовые палитры, контрасты и гармонические сочетания. Включает определение основных цветовых схем, распределение теплых и холодных тонов, оценку визуального воздействия цветовых комбинаций. Позволяет раскрыть художественный замысел через анализ цветовой выразительности.",
    Status: true,
    Image: "http://localhost:9000/art-center/abstract_2.jpg",
    Algorithm: "Анализ цветовой гармонии изображения",
    Name: "Анна Смирнова",
  },
  {
    ID_artcenter: 3,
    Title: "Оценка композиции фотографий",
    Description:
      "Выявление сильных и слабых сторон композиции фотографии, рекомендации по улучшению.",
    Status: true,
    Image: "http://localhost:9000/art-center/abstract_3.jpg",
    Algorithm: "Цифровой анализ",
    Name: "Иван Петров",
  },
];


export const getMockArtExpertById = (id: string): IArtExpert | null => {
  return MOCK_ART_EXPERTS.find(expert => expert.ID_artcenter === Number(id)) || null;
};


export const getMockArtExperts = (title?: string): IArtExpert[] => {
    if (!title) return MOCK_ART_EXPERTS;

    return MOCK_ART_EXPERTS.filter(expert =>
        expert.Title.toLowerCase().includes(title.toLowerCase())
    );
};