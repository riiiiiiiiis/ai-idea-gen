
import React, { useState, useCallback } from 'react';
import { generateAppIdeas } from './services/geminiService';
import { type PromptIdea } from './types';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { Footer } from './components/Footer';

// A new interface to ensure each prompt has a stable ID for React keys
interface PromptIdeaWithId extends PromptIdea {
  id: string;
}

// Preset profession options to lower user effort
const professionOptions: { label: string; value: string }[] = [
  { label: 'Предприниматель', value: 'для предпринимателя' },
  { label: 'Стартапер', value: 'для стартапера' },
  { label: 'Маркетолог', value: 'для маркетолога' },
  { label: 'Продакт‑менеджер', value: 'для продакт‑менеджера' },
  { label: 'SMM‑специалист', value: 'для SMM‑специалиста' },
  { label: 'Таргетолог', value: 'для таргетолога' },
  { label: 'Копирайтер', value: 'для копирайтера' },
  { label: 'SEO‑специалист', value: 'для SEO‑специалиста' },
  { label: 'Создатель контента', value: 'для создателя контента' },
  { label: 'Блогер', value: 'для блогера' },
  { label: 'Специалист по продажам', value: 'для специалиста по продажам' },
  { label: 'HR/Рекрутер', value: 'для HR‑специалиста' },
  { label: 'Коуч/Тренер', value: 'для коуча или тренера' },
  { label: 'Учитель', value: 'для учителя' },
  { label: 'Дизайнер', value: 'для дизайнера' },
  { label: 'No‑code‑создатель', value: 'для no‑code‑создателя' },
  { label: 'Бизнес‑аналитик', value: 'для бизнес‑аналитика' },
  { label: 'Проектный менеджер', value: 'для проектного менеджера' },
  { label: 'Фрилансер', value: 'для фрилансера' },
];

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptIdeaWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');

  const handleGenerateIdeas = useCallback(async (overrideTopic?: string) => {
    setIsLoading(true);
    setError(null);
    setCopiedId(null); // Reset copied state on new generation
    try {
      const effectiveTopic = overrideTopic ?? topic;
      const ideas = await generateAppIdeas(effectiveTopic);
      // Assign a unique ID to each new idea for stable keys
      const newIdeasWithIds: PromptIdeaWithId[] = ideas.map((idea) => ({
        ...idea,
        id: `${Date.now()}-${Math.random()}`
      }));
      // Prepend new ideas to the existing list
      setPrompts(prevPrompts => [...newIdeasWithIds, ...prevPrompts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка. Пожалуйста, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  // Updated to handle copying with a unique ID instead of an index
  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-mono flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-4xl mx-auto">
          {prompts.length === 0 && !isLoading && !error && (
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Найдите идею для следующего проекта</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                Получите 5 свежих идей для веб-приложений. Введите ключевое слово для уточнения или просто нажмите кнопку для случайных идей.
              </p>
            </div>
          )}

          {/* Profession presets at the very start to reduce user effort */}
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">Кому нужны идеи?</div>
            <div className="flex flex-wrap gap-2">
              {professionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setTopic(opt.value); handleGenerateIdeas(opt.value); }}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs md:text-sm rounded-md border transition-colors duration-200 focus:outline-none whitespace-nowrap ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  } bg-white text-gray-700 border-gray-200`}
                  aria-label={`Сгенерировать идеи ${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto mb-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: музыка, фитнес, утилиты..."
              disabled={isLoading}
              className="w-full px-4 py-2 text-base text-gray-900 bg-white border border-gray-200 rounded-md transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Тема для идей"
            />
          </div>

          <div className="flex justify-center mb-10">
            <button
              onClick={() => handleGenerateIdeas()}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-colors duration-200 bg-gray-900 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Генерация...
                </>
              ) : (
                <>
                  {prompts.length > 0 ? 'Получить другие идеи' : 'Сгенерировать идеи'}
                </>
              )}
            </button>
          </div>
          
          {error && (
              <div className="text-center bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-md text-sm" role="alert">
                  <strong className="font-bold">Ошибка: </strong>
                  <span className="block sm:inline">{error}</span>
              </div>
          )}

          {prompts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((idea) => (
                <PromptCard
                  key={idea.id}
                  title={idea.title}
                  prompt={idea.prompt}
                  isCopied={copiedId === idea.id}
                  onCopy={() => handleCopy(idea.prompt, idea.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
