"use client";

// src/components/AccessibilityPanel.tsx
// Panel de accesibilidad flotante y ARRASTRABLE — WCAG 2.1 AAA
// El botón se puede mover a cualquier posición de la pantalla
// La posición se guarda en localStorage

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useA11y, FontSize, ContrastMode } from "./AccessibilityProvider";

// ─── Ícono accesibilidad ──────────────────────────────────────────────────────

function A11yIcon({ size = 20 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
            <path d="M12 7v6" />
            <path d="M8 9l4 1 4-1" />
            <path d="M10 17l-2 3" />
            <path d="M14 17l2 3" />
            <path d="M12 13v4" />
        </svg>
    );
}

// ─── Ícono de agarre (drag handle) ───────────────────────────────────────────

function DragIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <circle cx="2" cy="2" r="1" /><circle cx="5" cy="2" r="1" /><circle cx="8" cy="2" r="1" />
            <circle cx="2" cy="5" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="8" cy="5" r="1" />
            <circle cx="2" cy="8" r="1" /><circle cx="5" cy="8" r="1" /><circle cx="8" cy="8" r="1" />
        </svg>
    );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
    id, label, checked, onChange, description,
}: {
    id: string; label: string; checked: boolean; onChange: () => void; description?: string;
}) {
    return (
        <div className="a11y-toggle-row">
            <div className="a11y-toggle-info">
                <label htmlFor={id} className="a11y-toggle-label">{label}</label>
                {description && (
                    <span id={`${id}-desc`} className="a11y-toggle-desc">{description}</span>
                )}
            </div>
            <button
                id={id}
                role="switch"
                aria-checked={checked}
                aria-describedby={description ? `${id}-desc` : undefined}
                onClick={onChange}
                className={`a11y-switch ${checked ? "a11y-switch--on" : ""}`}
            >
                <span className="a11y-switch-thumb" />
                <span className="sr-only">{checked ? "Activado" : "Desactivado"}</span>
            </button>
        </div>
    );
}

// ─── Opciones ─────────────────────────────────────────────────────────────────

const FONT_OPTIONS: { value: FontSize; label: string; aria: string }[] = [
    { value: "normal", label: "A", aria: "Tamaño normal" },
    { value: "large", label: "A", aria: "Tamaño grande (115%)" },
    { value: "xl", label: "A", aria: "Tamaño muy grande (130%)" },
    { value: "xxl", label: "A", aria: "Tamaño extra grande (150%)" },
];

const CONTRAST_OPTIONS: { value: ContrastMode; label: string; aria: string }[] = [
    { value: "default", label: "Normal", aria: "Contraste por defecto" },
    { value: "high", label: "Alto", aria: "Alto contraste" },
    { value: "inverted", label: "Invertido", aria: "Colores invertidos" },
];

// ─── Posición por defecto y clave de storage ──────────────────────────────────

const POS_KEY = "a11y-position";
const DEFAULT_POS = { x: 24, y: -1 }; // x desde izquierda, y negativo = desde abajo

// ─── Hook de arrastre ────────────────────────────────────────────────────────

function useDraggable(buttonSize = 48) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const dragging = useRef(false);
    const startOffset = useRef({ x: 0, y: 0 });
    const posRef = useRef(pos);
    posRef.current = pos;

    // Cargar posición guardada
    useEffect(() => {
        try {
            const saved = localStorage.getItem(POS_KEY);
            if (saved) {
                setPos(JSON.parse(saved));
                return;
            }
        } catch { /* ignorar */ }
        // Posición inicial: esquina inferior izquierda
        setPos({ x: 24, y: window.innerHeight - buttonSize - 24 });
    }, [buttonSize]);

    // Clampear dentro de la ventana
    const clamp = useCallback((x: number, y: number) => {
        const maxX = window.innerWidth - buttonSize;
        const maxY = window.innerHeight - buttonSize;
        return {
            x: Math.max(0, Math.min(x, maxX)),
            y: Math.max(0, Math.min(y, maxY)),
        };
    }, [buttonSize]);

    // Guardar posición
    const savePos = useCallback((p: { x: number; y: number }) => {
        try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch { /* ignorar */ }
    }, []);

    // ── Eventos de ratón ──────────────────────────────────────────────────────
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest(".a11y-no-drag")) return;
        dragging.current = true;
        startOffset.current = {
            x: e.clientX - (posRef.current?.x ?? 0),
            y: e.clientY - (posRef.current?.y ?? 0),
        };
        e.preventDefault();
    }, []);

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            if (!dragging.current) return;
            const p = clamp(e.clientX - startOffset.current.x, e.clientY - startOffset.current.y);
            setPos(p);
        }
        function onMouseUp() {
            if (!dragging.current) return;
            dragging.current = false;
            if (posRef.current) savePos(posRef.current);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [clamp, savePos]);

    // ── Eventos táctiles ──────────────────────────────────────────────────────
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if ((e.target as HTMLElement).closest(".a11y-no-drag")) return;
        dragging.current = true;
        const t = e.touches[0];
        startOffset.current = {
            x: t.clientX - (posRef.current?.x ?? 0),
            y: t.clientY - (posRef.current?.y ?? 0),
        };
    }, []);

    useEffect(() => {
        function onTouchMove(e: TouchEvent) {
            if (!dragging.current) return;
            const t = e.touches[0];
            const p = clamp(t.clientX - startOffset.current.x, t.clientY - startOffset.current.y);
            setPos(p);
            e.preventDefault();
        }
        function onTouchEnd() {
            if (!dragging.current) return;
            dragging.current = false;
            if (posRef.current) savePos(posRef.current);
        }
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        return () => {
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [clamp, savePos]);

    // Recalcular al redimensionar ventana
    useEffect(() => {
        function onResize() {
            setPos((prev) => prev ? clamp(prev.x, prev.y) : prev);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [clamp]);

    return { pos, onMouseDown, onTouchStart };
}

// ─── Panel principal ──────────────────────────────────────────────────────────

export function AccessibilityPanel() {
    const BUTTON_SIZE = 48;
    const { pos, onMouseDown, onTouchStart } = useDraggable(BUTTON_SIZE);
    const [open, setOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const clickCancelled = useRef(false);
    const dragStartPos = useRef({ x: 0, y: 0 });

    const {
        settings, setFontSize, setContrastMode,
        toggleReduceMotion, toggleFocusHighlight,
        toggleDyslexiaFont, toggleLineSpacing, resetSettings,
    } = useA11y();

    // Detectar si fue arrastre real (para no abrir el panel)
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        clickCancelled.current = false;
        setIsDragging(false);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const dx = Math.abs(e.clientX - dragStartPos.current.x);
        const dy = Math.abs(e.clientY - dragStartPos.current.y);
        if (dx > 5 || dy > 5) {
            clickCancelled.current = true;
            setIsDragging(true);
        }
    }, []);

    const handlePointerUp = useCallback(() => {
        setTimeout(() => setIsDragging(false), 100);
    }, []);

    const handleClick = useCallback(() => {
        if (clickCancelled.current) return;
        setOpen((v) => !v);
    }, []);

    // Escape key
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && open) {
                setOpen(false);
                triggerRef.current?.focus();
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    // Focus al abrir
    useEffect(() => {
        if (open) {
            const first = panelRef.current?.querySelector<HTMLElement>(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );
            first?.focus();
        }
    }, [open]);

    // Click fuera
    useEffect(() => {
        function onOut(e: MouseEvent) {
            if (open &&
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                !triggerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onOut);
        return () => document.removeEventListener("mousedown", onOut);
    }, [open]);

    const hasChanges =
        settings.fontSize !== "normal" || settings.contrastMode !== "default" ||
        settings.reduceMotion || settings.focusHighlight ||
        settings.dyslexiaFont || settings.lineSpacing;

    // Determinar si el panel va arriba o abajo del botón
    const panelGoesUp = pos ? pos.y > window.innerHeight / 2 : true;
    // Determinar si el panel va a la derecha o izquierda
    const panelGoesRight = pos ? pos.x < window.innerWidth / 2 : true;

    if (!pos) return null; // Sin hidratación SSR

    return (
        <>
            <style>{PANEL_STYLES}</style>

            {/* Wrapper posicionado en fixed con la posición del drag */}
            <div
                className="a11y-root"
                style={{
                    position: "fixed",
                    left: pos.x,
                    top: pos.y,
                    zIndex: 9000,
                    userSelect: "none",
                    touchAction: "none",
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                {/* ── Botón trigger ──────────────────────────────────────────── */}
                <button
                    ref={triggerRef}
                    className={`a11y-trigger ${isDragging ? "a11y-trigger--dragging" : ""}`}
                    style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onClick={handleClick}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    aria-label="Opciones de accesibilidad (arrastrable)"
                    title="Accesibilidad — arrastra para mover"
                >
                    {/* Indicador de drag */}
                    <span className="a11y-drag-hint" aria-hidden="true">
                        <DragIcon />
                    </span>
                    <A11yIcon size={22} />
                    {hasChanges && <span className="a11y-dot" aria-label="Configuración activa" />}
                </button>

                {/* ── Panel ──────────────────────────────────────────────────── */}
                {open && (
                    <div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Panel de accesibilidad"
                        className="a11y-panel a11y-no-drag"
                        style={{
                            [panelGoesUp ? "bottom" : "top"]: BUTTON_SIZE + 8,
                            [panelGoesRight ? "left" : "right"]: 0,
                        }}
                    >
                        {/* Cabecera */}
                        <div className="a11y-header">
                            <h2 className="a11y-title">
                                <A11yIcon size={16} />
                                Accesibilidad
                            </h2>
                            <button
                                className="a11y-close a11y-no-drag"
                                onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
                                aria-label="Cerrar panel de accesibilidad"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                    <path d="M1 1l12 12M13 1L1 13" />
                                </svg>
                            </button>
                        </div>

                        {/* Tamaño de texto */}
                        <section className="a11y-section a11y-no-drag" aria-labelledby="a11y-fontsize-label">
                            <p id="a11y-fontsize-label" className="a11y-section-title">Tamaño de texto</p>
                            <div className="a11y-font-group" role="group" aria-labelledby="a11y-fontsize-label">
                                {FONT_OPTIONS.map((opt, i) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFontSize(opt.value)}
                                        aria-pressed={settings.fontSize === opt.value}
                                        aria-label={opt.aria}
                                        title={opt.aria}
                                        className={`a11y-font-btn a11y-font-btn--${i} ${settings.fontSize === opt.value ? "a11y-font-btn--active" : ""}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Contraste */}
                        <section className="a11y-section a11y-no-drag" aria-labelledby="a11y-contrast-label">
                            <p id="a11y-contrast-label" className="a11y-section-title">Contraste de color</p>
                            <div className="a11y-contrast-group" role="group" aria-labelledby="a11y-contrast-label">
                                {CONTRAST_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setContrastMode(opt.value)}
                                        aria-pressed={settings.contrastMode === opt.value}
                                        aria-label={opt.aria}
                                        className={`a11y-contrast-btn a11y-contrast-btn--${opt.value} ${settings.contrastMode === opt.value ? "a11y-contrast-btn--active" : ""}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Opciones visuales */}
                        <section className="a11y-section a11y-no-drag" aria-labelledby="a11y-visual-label">
                            <p id="a11y-visual-label" className="a11y-section-title">Opciones visuales</p>
                            <Toggle id="a11y-reduce-motion" label="Reducir movimiento"
                                description="Desactiva animaciones y transiciones"
                                checked={settings.reduceMotion} onChange={toggleReduceMotion} />
                            <Toggle id="a11y-focus-highlight" label="Resaltar foco"
                                description="Hace el indicador de foco más visible"
                                checked={settings.focusHighlight} onChange={toggleFocusHighlight} />
                            <Toggle id="a11y-dyslexia" label="Fuente para dislexia"
                                description="Cambia la tipografía para facilitar la lectura"
                                checked={settings.dyslexiaFont} onChange={toggleDyslexiaFont} />
                            <Toggle id="a11y-line-spacing" label="Mayor interlineado"
                                description="Aumenta el espacio entre líneas de texto"
                                checked={settings.lineSpacing} onChange={toggleLineSpacing} />
                        </section>

                        {hasChanges && (
                            <div className="a11y-reset-wrap a11y-no-drag">
                                <button
                                    className="a11y-reset-btn"
                                    onClick={resetSettings}
                                    aria-label="Restaurar configuración de accesibilidad por defecto"
                                >
                                    Restaurar por defecto
                                </button>
                            </div>
                        )}

                        <p className="a11y-footer">Configuración guardada automáticamente</p>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const PANEL_STYLES = `
.a11y-trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid rgba(61, 214, 245, 0.5);
  background: #020818;
  color: #3dd6f5;
  cursor: grab;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 0 1px rgba(61,214,245,0.1), 0 4px 24px rgba(0,0,0,0.6);
  font-family: inherit;
}
.a11y-trigger:hover {
  background: rgba(61, 214, 245, 0.08);
  border-color: rgba(61, 214, 245, 0.8);
  box-shadow: 0 0 0 1px rgba(61,214,245,0.2), 0 6px 32px rgba(0,0,0,0.7);
}
.a11y-trigger--dragging {
  cursor: grabbing !important;
  border-color: #3dd6f5;
  box-shadow: 0 0 0 3px rgba(61,214,245,0.25), 0 8px 40px rgba(0,0,0,0.8) !important;
  transform: scale(1.08);
}
.a11y-trigger:focus-visible {
  outline: 3px solid #3dd6f5;
  outline-offset: 3px;
}

.a11y-drag-hint {
  position: absolute;
  top: 3px;
  right: 3px;
  color: rgba(61,214,245,0.35);
  line-height: 1;
  pointer-events: none;
  transition: color 0.2s;
}
.a11y-trigger:hover .a11y-drag-hint {
  color: rgba(61,214,245,0.6);
}

.a11y-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3dd6f5;
  border: 2px solid #020818;
  pointer-events: none;
}

.a11y-panel {
  position: absolute;
  width: 300px;
  background: #040f1e;
  border: 1px solid rgba(61, 214, 245, 0.2);
  border-radius: 1rem;
  padding: 0;
  box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(61,214,245,0.05);
  overflow: hidden;
  cursor: default;
}

.a11y-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid rgba(61, 214, 245, 0.1);
}
.a11y-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}
.a11y-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(61,214,245,0.2);
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.a11y-close:hover { background: rgba(61,214,245,0.08); color: #e2e8f0; }
.a11y-close:focus-visible { outline: 2px solid #3dd6f5; outline-offset: 2px; }

.a11y-section {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(61,214,245,0.07);
}
.a11y-section-title {
  font-size: 0.65rem;
  font-weight: 600;
  color: #3dd6f5;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.625rem 0;
}

.a11y-font-group {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}
.a11y-font-btn {
  flex: 1;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(61,214,245,0.2);
  background: rgba(4,15,30,0.8);
  color: #94a3b8;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.a11y-font-btn--0 { font-size: 0.75rem; }
.a11y-font-btn--1 { font-size: 0.875rem; }
.a11y-font-btn--2 { font-size: 1rem; }
.a11y-font-btn--3 { font-size: 1.125rem; }
.a11y-font-btn:hover { border-color: rgba(61,214,245,0.5); color: #e2e8f0; background: rgba(61,214,245,0.07); }
.a11y-font-btn--active { border-color: #3dd6f5 !important; color: #3dd6f5 !important; background: rgba(61,214,245,0.12) !important; }
.a11y-font-btn:focus-visible { outline: 2px solid #3dd6f5; outline-offset: 2px; }

.a11y-contrast-group { display: flex; gap: 0.5rem; }
.a11y-contrast-btn {
  flex: 1;
  padding: 0.5rem 0;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px solid rgba(61,214,245,0.2);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.a11y-contrast-btn--default { background: #020818; color: #94a3b8; }
.a11y-contrast-btn--high { background: #000; color: #fff; border-color: rgba(255,255,255,0.2); }
.a11y-contrast-btn--inverted { background: #e2e8f0; color: #020818; border-color: rgba(0,0,0,0.2); }
.a11y-contrast-btn:hover { border-color: rgba(61,214,245,0.5); box-shadow: 0 0 0 2px rgba(61,214,245,0.15); }
.a11y-contrast-btn--active { border-color: #3dd6f5 !important; box-shadow: 0 0 0 2px rgba(61,214,245,0.25) !important; }
.a11y-contrast-btn:focus-visible { outline: 2px solid #3dd6f5; outline-offset: 2px; }

.a11y-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.4rem 0;
}
.a11y-toggle-info { display: flex; flex-direction: column; gap: 0.1rem; }
.a11y-toggle-label { font-size: 0.8rem; font-weight: 500; color: #e2e8f0; cursor: pointer; }
.a11y-toggle-desc { font-size: 0.65rem; color: #64748b; line-height: 1.3; }

.a11y-switch {
  position: relative;
  flex-shrink: 0;
  width: 2.5rem;
  height: 1.375rem;
  border-radius: 999px;
  border: 2px solid rgba(61,214,245,0.2);
  background: rgba(4,15,30,0.9);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  padding: 0;
  font-family: inherit;
}
.a11y-switch--on { background: rgba(61,214,245,0.2); border-color: rgba(61,214,245,0.6); }
.a11y-switch-thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #475569;
  transition: transform 0.2s, background 0.2s;
  pointer-events: none;
}
.a11y-switch--on .a11y-switch-thumb { transform: translateX(16px); background: #3dd6f5; }
.a11y-switch:focus-visible { outline: 2px solid #3dd6f5; outline-offset: 2px; }

.a11y-reset-wrap { padding: 0.75rem 1rem 0; }
.a11y-reset-btn {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 1px dashed rgba(61,214,245,0.25);
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.a11y-reset-btn:hover { border-color: rgba(61,214,245,0.5); color: #94a3b8; background: rgba(61,214,245,0.04); }
.a11y-reset-btn:focus-visible { outline: 2px solid #3dd6f5; outline-offset: 2px; }

.a11y-footer { font-size: 0.6rem; color: #334155; text-align: center; padding: 0.625rem 1rem 0.875rem; margin: 0; }

@media (max-width: 360px) {
  .a11y-panel { width: 260px; }
}
`;