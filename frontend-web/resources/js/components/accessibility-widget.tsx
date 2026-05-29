import {
    Accessibility,
    AlignLeft,
    BookOpen,
    Contrast,
    EyeOff,
    ImageOff,
    Link as LinkIcon,
    ListTree,
    MousePointer2,
    Palette,
    Pause,
    RotateCcw,
    ScanLine,
    Sun,
    Type,
    Volume2,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'proviemplea_accessibility_preferences';
const POSITION_KEY = 'proviemplea_accessibility_position';
const BUTTON_SIZE = 64;
const SAFE_MARGIN = 16;

type ContrastMode = 'none' | 'high' | 'dark' | 'light';
type SaturationMode = 'none' | 'gray' | 'high' | 'low';

type AccessibilityPreferences = {
    textScale: number;
    contrast: ContrastMode;
    saturation: SaturationMode;
    highlightLinks: boolean;
    readableText: boolean;
    dyslexiaFont: boolean;
    textSpacing: boolean;
    lineHeight: boolean;
    largeCursor: boolean;
    readingGuide: boolean;
    readingMask: boolean;
    pauseAnimations: boolean;
    hideImages: boolean;
    pageStructure: boolean;
    visualTooltips: boolean;
};

type WidgetPosition = {
    x: number;
    y: number;
};

const defaultPreferences: AccessibilityPreferences = {
    textScale: 0,
    contrast: 'none',
    saturation: 'none',
    highlightLinks: false,
    readableText: false,
    dyslexiaFont: false,
    textSpacing: false,
    lineHeight: false,
    largeCursor: false,
    readingGuide: false,
    readingMask: false,
    pauseAnimations: false,
    hideImages: false,
    pageStructure: false,
    visualTooltips: false,
};

const classNames = [
    'proviemplea-a11y-text-sm-2',
    'proviemplea-a11y-text-sm-1',
    'proviemplea-a11y-text-lg-1',
    'proviemplea-a11y-text-lg-2',
    'proviemplea-a11y-text-lg-3',
    'proviemplea-a11y-contrast-high',
    'proviemplea-a11y-contrast-dark',
    'proviemplea-a11y-contrast-light',
    'proviemplea-a11y-gray',
    'proviemplea-a11y-saturation-high',
    'proviemplea-a11y-saturation-low',
    'proviemplea-a11y-highlight-links',
    'proviemplea-a11y-readable-text',
    'proviemplea-a11y-dyslexia-font',
    'proviemplea-a11y-text-spacing',
    'proviemplea-a11y-line-height',
    'proviemplea-a11y-large-cursor',
    'proviemplea-a11y-pause-animations',
    'proviemplea-a11y-hide-images',
    'proviemplea-a11y-page-structure',
    'proviemplea-a11y-visual-tooltips',
];

const hasUserWay = () => {
    if (typeof document === 'undefined') return false;

    return Boolean(document.querySelector('script[src*="userway"], script[src*="UserWay"], #userwayAccessibilityIcon, .uwy'));
};

const loadPreferences = (): AccessibilityPreferences => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return defaultPreferences;

        return { ...defaultPreferences, ...JSON.parse(stored) };
    } catch {
        return defaultPreferences;
    }
};

const savePreferences = (preferences: AccessibilityPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
};

const defaultPosition = (): WidgetPosition => ({
    x: Math.max(SAFE_MARGIN, window.innerWidth - BUTTON_SIZE - 24),
    y: Math.max(SAFE_MARGIN, window.innerHeight - BUTTON_SIZE - 24),
});

const clampPosition = (position: WidgetPosition): WidgetPosition => ({
    x: Math.min(Math.max(SAFE_MARGIN, position.x), window.innerWidth - BUTTON_SIZE - SAFE_MARGIN),
    y: Math.min(Math.max(SAFE_MARGIN, position.y), window.innerHeight - BUTTON_SIZE - SAFE_MARGIN),
});

const loadPosition = (): WidgetPosition => {
    try {
        const stored = localStorage.getItem(POSITION_KEY);
        if (!stored) return defaultPosition();

        return clampPosition(JSON.parse(stored));
    } catch {
        return defaultPosition();
    }
};

const savePosition = (position: WidgetPosition) => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position));
};

const applyPreferences = (preferences: AccessibilityPreferences) => {
    const root = document.documentElement;
    root.classList.remove(...classNames);

    if (preferences.textScale < 0) root.classList.add(`proviemplea-a11y-text-sm-${Math.abs(preferences.textScale)}`);
    if (preferences.textScale > 0) root.classList.add(`proviemplea-a11y-text-lg-${preferences.textScale}`);
    if (preferences.contrast !== 'none') root.classList.add(`proviemplea-a11y-contrast-${preferences.contrast}`);
    if (preferences.saturation === 'gray') root.classList.add('proviemplea-a11y-gray');
    if (preferences.saturation === 'high') root.classList.add('proviemplea-a11y-saturation-high');
    if (preferences.saturation === 'low') root.classList.add('proviemplea-a11y-saturation-low');
    if (preferences.highlightLinks) root.classList.add('proviemplea-a11y-highlight-links');
    if (preferences.readableText) root.classList.add('proviemplea-a11y-readable-text');
    if (preferences.dyslexiaFont) root.classList.add('proviemplea-a11y-dyslexia-font');
    if (preferences.textSpacing) root.classList.add('proviemplea-a11y-text-spacing');
    if (preferences.lineHeight) root.classList.add('proviemplea-a11y-line-height');
    if (preferences.largeCursor) root.classList.add('proviemplea-a11y-large-cursor');
    if (preferences.pauseAnimations) root.classList.add('proviemplea-a11y-pause-animations');
    if (preferences.hideImages) root.classList.add('proviemplea-a11y-hide-images');
    if (preferences.pageStructure) root.classList.add('proviemplea-a11y-page-structure');
    if (preferences.visualTooltips) root.classList.add('proviemplea-a11y-visual-tooltips');
};

export default function AccessibilityWidget() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [guideY, setGuideY] = useState(0);
    const [position, setPosition] = useState<WidgetPosition | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dragStateRef = useRef({ pointerId: 0, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });

    useEffect(() => {
        if (hasUserWay()) return;

        const nextPreferences = loadPreferences();
        setPreferences(nextPreferences);
        setPosition(loadPosition());
        applyPreferences(nextPreferences);
        setIsAvailable(true);
    }, []);

    useEffect(() => {
        if (!isAvailable) return;

        applyPreferences(preferences);
        savePreferences(preferences);
    }, [isAvailable, preferences]);

    useEffect(() => {
        if (!isAvailable || !position) return;

        savePosition(position);
    }, [isAvailable, position]);

    useEffect(() => {
        if (!isAvailable) return;

        const handleResize = () => setPosition((current) => (current ? clampPosition(current) : defaultPosition()));
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [isAvailable]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
            setIsOpen(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!preferences.readingGuide && !preferences.readingMask) return;

        const handlePointerMove = (event: PointerEvent) => setGuideY(event.clientY);
        document.addEventListener('pointermove', handlePointerMove);

        return () => document.removeEventListener('pointermove', handlePointerMove);
    }, [preferences.readingGuide, preferences.readingMask]);

    if (!isAvailable) return null;

    const updatePreferences = (updater: (current: AccessibilityPreferences) => AccessibilityPreferences) => {
        setPreferences((current) => updater(current));
    };

    const setContrast = (contrast: ContrastMode) => {
        updatePreferences((current) => ({ ...current, contrast: current.contrast === contrast ? 'none' : contrast }));
    };

    const setSaturation = (saturation: SaturationMode) => {
        updatePreferences((current) => ({ ...current, saturation: current.saturation === saturation ? 'none' : saturation }));
    };

    const toggle = (key: keyof AccessibilityPreferences) => {
        updatePreferences((current) => ({ ...current, [key]: !current[key] }));
    };

    const resetAll = () => {
        localStorage.removeItem(STORAGE_KEY);
        window.speechSynthesis?.cancel();
        setPreferences(defaultPreferences);
        applyPreferences(defaultPreferences);
    };

    const readContent = () => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const selection = window.getSelection()?.toString().trim();
        const mainContent = document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim();
        const text = selection || mainContent || 'No hay contenido disponible para lectura.';
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 3500));
        utterance.lang = 'es-CL';
        window.speechSynthesis.speak(utterance);
    };

    const moveToCorner = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
        const nextPosition = {
            'top-left': { x: SAFE_MARGIN, y: SAFE_MARGIN },
            'top-right': { x: window.innerWidth - BUTTON_SIZE - SAFE_MARGIN, y: SAFE_MARGIN },
            'bottom-left': { x: SAFE_MARGIN, y: window.innerHeight - BUTTON_SIZE - SAFE_MARGIN },
            'bottom-right': { x: window.innerWidth - BUTTON_SIZE - SAFE_MARGIN, y: window.innerHeight - BUTTON_SIZE - SAFE_MARGIN },
        }[corner];

        setPosition(clampPosition(nextPosition));
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!position) return;

        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
            moved: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
        const dragState = dragStateRef.current;
        if (!isDragging || dragState.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - dragState.startX;
        const deltaY = event.clientY - dragState.startY;
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) dragState.moved = true;

        setPosition(clampPosition({ x: dragState.originX + deltaX, y: dragState.originY + deltaY }));
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (dragStateRef.current.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setIsDragging(false);
        }
    };

    const handleButtonClick = () => {
        if (dragStateRef.current.moved) {
            dragStateRef.current.moved = false;
            return;
        }

        setIsOpen((current) => !current);
    };

    const widgetStyle = position
        ? ({ left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' } satisfies CSSProperties)
        : undefined;

    const panelStyle = position
        ? ({
              transform: position.x > window.innerWidth / 2 ? 'translateX(calc(-100% + 4rem))' : 'none',
          } satisfies CSSProperties)
        : undefined;

    return (
        <>
            {preferences.readingGuide && <div className="proviemplea-reading-guide" style={{ top: `${guideY}px` }} aria-hidden="true" />}
            {preferences.readingMask && <div className="proviemplea-reading-mask" style={{ '--mask-y': `${guideY}px` } as CSSProperties} aria-hidden="true" />}

            <aside className="proviemplea-accessibility-widget fixed z-[70]" style={widgetStyle} aria-label="Widget de accesibilidad">
                {isOpen && (
                    <div
                        ref={panelRef}
                        id="proviemplea-accessibility-panel"
                        className="absolute bottom-[calc(100%+1rem)] left-0 max-h-[min(78vh,760px)] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white text-provi-dark shadow-2xl shadow-slate-950/20 sm:w-[28rem]"
                        style={panelStyle}
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby="proviemplea-accessibility-title"
                    >
                        <div className="bg-provi-dark px-5 py-4 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p id="proviemplea-accessibility-title" className="text-lg font-black">
                                        Accesibilidad
                                    </p>
                                    <p className="mt-1 text-sm text-slate-300">Panel visual inspirado en widgets tipo UserWay.</p>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-full p-2 text-white transition hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-provi-primary/40 focus-visible:outline-none"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Cerrar panel de accesibilidad"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[calc(min(78vh,760px)-5rem)] overflow-y-auto p-4">
                            <section aria-labelledby="accessibility-text-heading">
                                <h3 id="accessibility-text-heading" className="px-1 text-xs font-black tracking-[0.18em] text-provi-muted uppercase">
                                    Texto y lectura
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <ControlButton icon={Type} label="Aumentar texto" detail={`Nivel ${preferences.textScale}`} onClick={() => updatePreferences((current) => ({ ...current, textScale: Math.min(3, current.textScale + 1) }))} />
                                    <ControlButton icon={Type} label="Disminuir texto" detail={`Nivel ${preferences.textScale}`} onClick={() => updatePreferences((current) => ({ ...current, textScale: Math.max(-2, current.textScale - 1) }))} />
                                    <ControlButton icon={RotateCcw} label="Restablecer texto" onClick={() => updatePreferences((current) => ({ ...current, textScale: 0 }))} />
                                    <ControlButton icon={AlignLeft} label="Texto legible" active={preferences.readableText} onClick={() => toggle('readableText')} />
                                    <ControlButton icon={BookOpen} label="Fuente dislexia" active={preferences.dyslexiaFont} onClick={() => toggle('dyslexiaFont')} />
                                    <ControlButton icon={AlignLeft} label="Espaciado texto" active={preferences.textSpacing} onClick={() => toggle('textSpacing')} />
                                    <ControlButton icon={AlignLeft} label="Altura de linea" active={preferences.lineHeight} onClick={() => toggle('lineHeight')} />
                                    <ControlButton icon={Volume2} label="Leer contenido" onClick={readContent} />
                                </div>
                            </section>

                            <section className="mt-5" aria-labelledby="accessibility-contrast-heading">
                                <h3 id="accessibility-contrast-heading" className="px-1 text-xs font-black tracking-[0.18em] text-provi-muted uppercase">
                                    Contraste y color
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <ControlButton icon={Contrast} label="Alto contraste" active={preferences.contrast === 'high'} onClick={() => setContrast('high')} />
                                    <ControlButton icon={Contrast} label="Contraste oscuro" active={preferences.contrast === 'dark'} onClick={() => setContrast('dark')} />
                                    <ControlButton icon={Sun} label="Contraste claro" active={preferences.contrast === 'light'} onClick={() => setContrast('light')} />
                                    <ControlButton icon={Palette} label="Escala grises" active={preferences.saturation === 'gray'} onClick={() => setSaturation('gray')} />
                                    <ControlButton icon={Palette} label="Saturacion alta" active={preferences.saturation === 'high'} onClick={() => setSaturation('high')} />
                                    <ControlButton icon={Palette} label="Saturacion baja" active={preferences.saturation === 'low'} onClick={() => setSaturation('low')} />
                                </div>
                            </section>

                            <section className="mt-5" aria-labelledby="accessibility-navigation-heading">
                                <h3 id="accessibility-navigation-heading" className="px-1 text-xs font-black tracking-[0.18em] text-provi-muted uppercase">
                                    Navegacion y enfoque
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <ControlButton icon={LinkIcon} label="Resaltar enlaces" active={preferences.highlightLinks} onClick={() => toggle('highlightLinks')} />
                                    <ControlButton icon={MousePointer2} label="Cursor grande" active={preferences.largeCursor} onClick={() => toggle('largeCursor')} />
                                    <ControlButton icon={ScanLine} label="Guia lectura" active={preferences.readingGuide} onClick={() => toggle('readingGuide')} />
                                    <ControlButton icon={ScanLine} label="Mascara lectura" active={preferences.readingMask} onClick={() => toggle('readingMask')} />
                                    <ControlButton icon={Pause} label="Pausar animaciones" active={preferences.pauseAnimations} onClick={() => toggle('pauseAnimations')} />
                                    <ControlButton icon={ImageOff} label="Ocultar imagenes" active={preferences.hideImages} onClick={() => toggle('hideImages')} />
                                    <ControlButton icon={ListTree} label="Estructura pagina" active={preferences.pageStructure} onClick={() => toggle('pageStructure')} />
                                    <ControlButton icon={EyeOff} label="Ayudas visuales" active={preferences.visualTooltips} onClick={() => toggle('visualTooltips')} />
                                </div>
                            </section>

                            <section className="mt-5" aria-labelledby="accessibility-future-heading">
                                <h3 id="accessibility-future-heading" className="px-1 text-xs font-black tracking-[0.18em] text-provi-muted uppercase">
                                    Integraciones futuras
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <ControlButton icon={Volume2} label="Lector externo" detail="Preparado" disabled />
                                    <ControlButton icon={BookOpen} label="Diccionario" detail="Proximamente" disabled />
                                </div>
                            </section>

                            <section className="mt-5" aria-labelledby="accessibility-position-heading">
                                <h3 id="accessibility-position-heading" className="px-1 text-xs font-black tracking-[0.18em] text-provi-muted uppercase">
                                    Posicion del boton
                                </h3>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button type="button" className="rounded-2xl border border-slate-200 bg-provi-light p-3 text-sm font-black text-provi-dark hover:bg-white" onClick={() => moveToCorner('top-left')}>
                                        Arriba izquierda
                                    </button>
                                    <button type="button" className="rounded-2xl border border-slate-200 bg-provi-light p-3 text-sm font-black text-provi-dark hover:bg-white" onClick={() => moveToCorner('top-right')}>
                                        Arriba derecha
                                    </button>
                                    <button type="button" className="rounded-2xl border border-slate-200 bg-provi-light p-3 text-sm font-black text-provi-dark hover:bg-white" onClick={() => moveToCorner('bottom-left')}>
                                        Abajo izquierda
                                    </button>
                                    <button type="button" className="rounded-2xl border border-slate-200 bg-provi-light p-3 text-sm font-black text-provi-dark hover:bg-white" onClick={() => moveToCorner('bottom-right')}>
                                        Abajo derecha
                                    </button>
                                </div>
                            </section>

                            <button
                                type="button"
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-provi-dark px-4 py-3 text-sm font-black text-white transition hover:bg-provi-dark/90 focus-visible:ring-4 focus-visible:ring-provi-primary/40 focus-visible:outline-none"
                                onClick={resetAll}
                            >
                                <RotateCcw className="h-4 w-4" />
                                Restablecer todo
                            </button>
                        </div>
                    </div>
                )}

                <button
                    ref={buttonRef}
                    type="button"
                    className={`flex h-16 w-16 touch-none items-center justify-center rounded-full bg-provi-purple text-white shadow-2xl shadow-provi-purple/35 transition hover:bg-provi-purple/90 focus-visible:ring-4 focus-visible:ring-provi-yellow/70 focus-visible:outline-none ${isDragging ? 'scale-105 cursor-grabbing' : 'cursor-grab hover:-translate-y-1'}`}
                    onClick={handleButtonClick}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    aria-label={isOpen ? 'Cerrar panel de accesibilidad' : 'Abrir panel de accesibilidad'}
                    aria-controls="proviemplea-accessibility-panel"
                    aria-expanded={isOpen}
                >
                    <Accessibility className="h-8 w-8" aria-hidden="true" />
                </button>
            </aside>
        </>
    );
}

function ControlButton({
    icon: Icon,
    label,
    detail,
    active = false,
    disabled = false,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    detail?: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            className={`min-h-20 rounded-2xl border p-3 text-left transition focus-visible:ring-4 focus-visible:ring-provi-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 ${
                active ? 'border-provi-primary bg-provi-primary/12 text-provi-dark shadow-sm' : 'border-slate-200 bg-provi-light text-provi-dark hover:border-provi-primary/50 hover:bg-white'
            }`}
            onClick={onClick}
            disabled={disabled}
            aria-pressed={disabled ? undefined : active}
            aria-label={label}
            title={detail ? `${label}: ${detail}` : label}
        >
            <Icon className="h-5 w-5 text-provi-secondary" aria-hidden="true" />
            <span className="mt-2 block text-sm font-black leading-tight">{label}</span>
            {detail && <span className="mt-1 block text-xs font-semibold text-provi-muted">{detail}</span>}
        </button>
    );
}
