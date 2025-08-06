import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center p-4 mt-auto">
            <p className="text-gray-600 text-xs">
                Создано для школы <a href="#" className="text-gray-900 hover:underline">Vibecoding</a>
            </p>
        </footer>
    );
};