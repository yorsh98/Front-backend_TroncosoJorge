import { useEffect, useState } from 'react';

const TEXT_KEY = 'proviemplea_text_scale';
const CONTRAST_KEY = 'proviemplea_high_contrast';

export default function AccessibilityWidget() {
    const [textScale, setTextScale] = useState(0);
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        const storedScale = Number(localStorage.getItem(TEXT_KEY) ?? 0);
        const storedContrast = localStorage.getItem(CONTRAST_KEY) === '1';
        setTextScale(storedScale);
        setHighContrast(storedContrast);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('proviemplea-text-lg', textScale === 1);
        document.documentElement.classList.toggle('proviemplea-text-xl', textScale === 2);
        localStorage.setItem(TEXT_KEY, String(textScale));
    }, [textScale]);

    useEffect(() => {
        document.documentElement.classList.toggle('proviemplea-high-contrast', highContrast);
        localStorage.setItem(CONTRAST_KEY, highContrast ? '1' : '0');
    }, [highContrast]);

    const reset = () => {
        setTextScale(0);
        setHighContrast(false);
    };

    return (
        <aside
            className="fixed right-4 bottom-4 z-50 rounded-2xl border border-slate-200 bg-white/95 p-3 text-sm text-slate-900 shadow-xl backdrop-blur"
            aria-label="Widget de accesibilidad"
        >
            <p className="mb-2 font-bold text-teal-800">Accesibilidad</p>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    className="rounded-full border px-3 py-1 font-bold"
                    onClick={() => setTextScale((value) => Math.max(0, value - 1))}
                    aria-label="Disminuir texto"
                >
                    A-
                </button>
                <button
                    type="button"
                    className="rounded-full border px-3 py-1 font-bold"
                    onClick={() => setTextScale((value) => Math.min(2, value + 1))}
                    aria-label="Aumentar texto"
                >
                    A+
                </button>
                <button
                    type="button"
                    className="rounded-full border px-3 py-1 font-bold"
                    onClick={() => setHighContrast((value) => !value)}
                    aria-pressed={highContrast}
                >
                    Contraste
                </button>
                <button type="button" className="rounded-full border px-3 py-1" onClick={reset}>
                    Reset
                </button>
            </div>
        </aside>
    );
}
