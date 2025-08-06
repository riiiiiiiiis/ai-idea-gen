import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Vibecoding: Генератор Идей
      </h1>
      <p className="mt-1 text-base text-gray-600">Ваш источник вдохновения для AI-разработки</p>
    </header>
  );
};