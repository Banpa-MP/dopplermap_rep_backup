// src/constants.js
import React from 'react';

import { useState, useEffect } from 'react';

// --- MOTOR DE COLORES (PALETA ERPNEXT DARK THEME) ---
export const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const THEME = {
  bgApp: '#171717',       
  bgSidebar: '#1C1C1C',   
  bgSurface: '#262626',   
  bgHover: '#333333',     
  border: '#404040',      
  textMain: '#F5F5F5',    
  textMuted: '#A3A3A3',   
  
  green: '#10B981', yellow: '#F59E0B', orange: '#F97316', red: '#EF4444',
  cyan: '#06B6D4', blue: '#3B82F6', black: '#000000', grey: '#6B7280',
  
  unmapped: '#525252',    
  unmappedAlt: '#333333'  
};

// --- ICONOS ARTERIALES (Hemodinámicos y Morfológicos) ---
export const IconMultiphasic = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 12 L 5 12 L 9 4 L 13 16 L 16 10 L 19 12 L 22 12" /></svg>;
export const IconMonophasic = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 12 L 8 12 L 14 7 L 18 12 L 22 12" /></svg>;
export const IconLowRes = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 16 L 6 8 L 10 12 L 14 6 L 18 10 L 22 14" /></svg>;
export const IconHighRes = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 12 L 6 4 L 10 14 L 14 12 L 18 12 L 22 12" /></svg>;
export const IconInverted = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 12 L 6 20 L 10 14 L 14 18 L 18 12 L 22 12" /></svg>;
export const IconTardusParvus = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 12 L 8 12 L 16 9 L 20 12 L 22 12" /></svg>;

export const IconOccludedFlow = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><line x1="2" y1="12" x2="22" y2="12" /></svg>;

export const IconStenosisMild = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 6 2 L 6 8 C 10 10, 10 14, 6 16 L 6 22" />
    <path d="M 18 2 L 18 8 C 14 10, 14 14, 18 16 L 18 22" />
    <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" strokeWidth="1.5" />
  </svg>
);

export const IconStenosisSevere = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 6 2 L 6 9 L 11 12 L 6 15 L 6 22" />
    <path d="M 18 2 L 18 9 L 13 12 L 18 15 L 18 22" />
    <polygon points="1,8 1,16 6,12" fill="currentColor" />
    <polygon points="23,8 23,16 18,12" fill="currentColor" />
  </svg>
);

export const IconOcclusion = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 9 3 A 4.5 4.5 0 0 1 9 12 Z" fill="#000" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 9 12 A 4.5 4.5 0 0 1 9 21 Z" fill="#000" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const IconPlaqueSoft = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><path d="M 2 8 C 8 8, 10 12, 12 12 C 14 12, 16 8, 22 8 M 2 16 C 8 16, 10 12, 12 12 C 14 12, 16 16, 22 16" /></svg>;
export const IconPlaqueCalcified = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="3 4" strokeLinecap="butt" className={className} style={style}><path d="M 2 8 C 8 8, 10 12, 12 12 C 14 12, 16 8, 22 8 M 2 16 C 8 16, 10 12, 12 12 C 14 12, 16 16, 22 16" /></svg>;
export const IconPlaqueUlcerated = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 2 8 C 6 8, 8 10, 10 10 L 12 6 L 14 10 C 16 10, 18 8, 22 8 M 2 16 C 8 16, 10 12, 12 12 C 14 12, 16 16, 22 16" /></svg>;
export const IconGIM = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><line x1="2" y1="10" x2="22" y2="10"/><line x1="2" y1="14" x2="22" y2="14"/></svg>;

export const IconAneurysm = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><circle cx="12" cy="12" r="7" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /></svg>;
export const IconPseudo = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><circle cx="12" cy="7" r="5" /><path d="M 12 12 L 12 16" /><line x1="2" y1="16" x2="22" y2="16" /></svg>;

// --- ICONOS VENOSOS (HEMODINÁMICOS Y MORFOLÓGICOS) ---
export const IconVCompetent = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} style={style}><line x1="12" y1="4" x2="12" y2="20" /><polyline points="8,8 12,4 16,8" /></svg>;
export const IconVIncompetent = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} style={style}><line x1="12" y1="4" x2="12" y2="20" /><polyline points="8,16 12,20 16,16" /><polyline points="8,8 12,4 16,8" /></svg>;
export const IconVThrombosed = ({ className, style }) => <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className={className} style={style}><rect x="9" y="4" width="6" height="16" rx="3" /></svg>;

export const IconContinuousFlow = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <rect x="2" y="4" width="20" height="16" rx="3" strokeWidth="1.5" opacity="0.4" />
    <line x1="5" y1="10" x2="19" y2="10" strokeWidth="2.5" />
    <line x1="5" y1="16" x2="19" y2="16" strokeWidth="1.5" strokeDasharray="2 3" />
  </svg>
);

export const IconPulsatileFlow = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 20.84 4.61 a 5.5 5.5 0 0 0 -7.78 0 L 12 5.67 l -1.06 -1.06 a 5.5 5.5 0 0 0 -7.78 7.78 l 1.06 1.06 L 12 21.23 l 7.78 -7.78 l 1.06 -1.06 a 5.5 5.5 0 0 0 0 -7.78 z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M 3 12 L 7 12 L 9 6 L 13 18 L 15 12 L 21 12" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

export const IconVHypoplastic = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} style={style}><line x1="12" y1="4" x2="12" y2="10" /><line x1="12" y1="14" x2="12" y2="20" /></svg>;
export const IconVAplastic = ({ className, style }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}><circle cx="12" cy="4" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="20" r="2.5"/></svg>;
export const IconVAdhesions = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} style={style}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>;
export const IconVThickening = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><line x1="8" y1="2" x2="8" y2="22" /><line x1="16" y1="2" x2="16" y2="22" /></svg>;

export const IconVGulf = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><line x1="12" y1="2" x2="12" y2="8" /><circle cx="12" cy="12" r="4" fill="currentColor" /><line x1="12" y1="16" x2="12" y2="22" /></svg>;
export const IconPerfIncomp = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><circle cx="12" cy="12" r="8" /><line x1="12" y1="12" x2="12" y2="2" /><polyline points="8,6 12,2 16,6" /></svg>;

export const IconExtCompression = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 12 2 L 12 8 M 9 5 L 12 8 L 15 5" strokeWidth="2.5" />
    <path d="M 12 22 L 12 16 M 9 19 L 12 16 L 15 19" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="3" strokeDasharray="2 2"/>
  </svg>
);

export const IconVarices = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M 9 2 C 15 6, 5 10, 11 14 C 17 18, 7 22, 13 24" strokeWidth="2.5" />
    <path d="M 12 11 C 16 10, 18 14, 21 12" strokeWidth="1.5" />
    <path d="M 10 16 C 6 18, 4 14, 2 16" strokeWidth="1.5" />
  </svg>
);

// --- OVALOS (ESTRUCTURAS EXTERNAS) ---
export const IconOvalNerve = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><ellipse cx="12" cy="12" rx="8" ry="5" fill={THEME.yellow} stroke={THEME.yellow} /></svg>;
export const IconOvalGanglion = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><ellipse cx="12" cy="12" rx="8" ry="5" fill={THEME.green} stroke={THEME.green} /></svg>;
export const IconOvalNonVasc = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><ellipse cx="12" cy="12" rx="8" ry="5" fill={THEME.blue} stroke={THEME.blue} /></svg>;

// --- INTERVENCIONES QUIRÚRGICAS ---
export const IconBypass = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 4" className={className} style={style}><path d="M 4 12 C 8 2, 16 2, 20 12" /></svg>;
export const IconStent = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><rect x="4" y="8" width="16" height="8" /><path d="M 6 8 L 10 16 M 10 8 L 14 16 M 14 8 L 18 16 M 18 8 L 22 16 M 6 16 L 10 8 M 10 16 L 14 8 M 14 16 L 18 8 M 18 16 L 22 8" /></svg>;
export const IconEndarterectomy = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}><path d="M 2 12 L 22 12 M 6 8 L 10 16 M 14 8 L 18 16" /></svg>;
export const IconAngioplasty = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" className={className} style={style}><path d="M 2 12 C 6 12, 8 6, 12 6 C 16 6, 18 12, 22 12 M 2 12 C 6 12, 8 18, 12 18 C 16 18, 18 12, 22 12" /></svg>;
export const IconSaphenectomy = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} style={style}><line x1="4" y1="12" x2="20" y2="12" /><line x1="8" y1="8" x2="8" y2="16" /><line x1="16" y1="8" x2="16" y2="16" /></svg>;
export const IconLaser = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M 12 22 L 12 8 M 9 5 L 12 2 L 15 5 M 9 10 L 15 10 M 9 14 L 15 14" /></svg>;
export const IconFoam = ({ className, style }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><rect x="10" y="8" width="4" height="10" rx="1"/><path d="M12 22 L12 18" /><path d="M10 4 L14 4 M12 4 L12 8" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="10" y1="11" x2="14" y2="11" /><line x1="10" y1="14" x2="14" y2="14" /></svg>;

// --- DICCIONARIOS UNIFICADOS DE HERRAMIENTAS ---
export const MASTER_TOOLS = [
  // Flujos Arteriales
  { id: 'multiphasic', name: 'Multifásico', icon: IconMultiphasic, hex: THEME.green, category: 'color' },
  { id: 'monophasic', name: 'Monofásico', icon: IconMonophasic, hex: THEME.orange, category: 'color' },
  { id: 'low_res', name: 'Baja Resist.', icon: IconLowRes, hex: THEME.green, category: 'color' },
  { id: 'high_res', name: 'Alta Resist.', icon: IconHighRes, hex: THEME.orange, category: 'color' },
  { id: 'inverted', name: 'Flujo Invert.', icon: IconInverted, hex: THEME.blue, category: 'color' },
  { id: 'tardus', name: 'Tardus Parvus', icon: IconTardusParvus, hex: THEME.red, category: 'color' },
  { id: 'occluded', name: 'Flujo Ocluido', icon: IconOccludedFlow, hex: THEME.textMuted, category: 'color' }, 
  
  // Flujos Venosos
  { id: 'v_competent', name: 'Competente', icon: IconVCompetent, hex: THEME.blue, category: 'color' },
  { id: 'v_incompetent', name: 'Incompetente (Reflujo)', icon: IconVIncompetent, hex: THEME.red, category: 'color' },
  { id: 'v_thrombosed', name: 'Trombosis Total', icon: IconVThrombosed, hex: THEME.black, category: 'color' },
  { id: 'v_ablated', name: 'Ablacionada', icon: IconLaser, hex: THEME.grey, category: 'color' }, 
  
  // Flujos Venosos Espectrales (Categoría FOCAL para no borrar el color de la vena)
  { id: 'v_continuous', name: 'Flujo Continuo', icon: IconContinuousFlow, hex: THEME.cyan, category: 'focal' },
  { id: 'v_pulsatile', name: 'Flujo Pulsátil', icon: IconPulsatileFlow, hex: THEME.cyan, category: 'focal' },
  
  // Pared
  { id: 'gim', name: 'GIM Aumentado', icon: IconGIM, hex: THEME.textMain, category: 'trayecto' },
  { id: 'soft', name: 'Placa Blanda', icon: IconPlaqueSoft, hex: THEME.textMain, category: 'trayecto' },
  { id: 'calcified', name: 'Placa Cálcica', icon: IconPlaqueCalcified, hex: THEME.textMain, category: 'trayecto' },
  { id: 'ulcerated', name: 'Placa Ulcerada', icon: IconPlaqueUlcerated, hex: THEME.textMain, category: 'trayecto' },
  
  { id: 'v_hypoplastic', name: 'Vía Hipoplásica', icon: IconVHypoplastic, hex: THEME.textMain, category: 'trayecto' },
  { id: 'v_aplastic', name: 'Aplasia/Agenesia', icon: IconVAplastic, hex: THEME.textMain, category: 'trayecto' },
  { id: 'v_adhesions', name: 'Sinequias/Post-Tromb.', icon: IconVAdhesions, hex: THEME.textMain, category: 'trayecto' },
  { id: 'v_thickening', name: 'Engrosamiento Parietal', icon: IconVThickening, hex: THEME.textMain, category: 'trayecto' },
  { id: 'v_gulf', name: 'Golfo Venoso', icon: IconVGulf, hex: THEME.textMain, category: 'trayecto' },
  
  // Focal
  { id: 'varices', name: 'Varices / Colat.', icon: IconVarices, hex: THEME.cyan, category: 'global' },
  { id: 'stenosis_mild', name: 'Est. 50-74%', icon: IconStenosisMild, hex: THEME.textMain, category: 'focal' },
  { id: 'stenosis_severe', name: 'Est. >75%', icon: IconStenosisSevere, hex: THEME.red, category: 'focal' },
  { id: 'aneurysm', name: 'Aneurisma', icon: IconAneurysm, hex: THEME.orange, category: 'focal' },
  { id: 'pseudo', name: 'Pseudoaneur.', icon: IconPseudo, hex: THEME.orange, category: 'focal' },
  { id: 'occlusion', name: 'Suboclusión', icon: IconOcclusion, hex: THEME.textMuted, category: 'focal' }, // Funciona como Trombo Parcial
  { id: 'v_ext_comp', name: 'Compresión Extrínseca', icon: IconExtCompression, hex: THEME.orange, category: 'focal' },
  { id: 'perf_incompetent', name: 'Perf. Incompetente', icon: IconPerfIncomp, hex: THEME.red, category: 'focal' },
  
  // Óvalos
  { id: 'oval_nerve', name: 'Nervios', icon: IconOvalNerve, hex: THEME.yellow, category: 'focal' },
  { id: 'oval_ganglion', name: 'Ganglios', icon: IconOvalGanglion, hex: THEME.green, category: 'focal' },
  { id: 'oval_nonvasc', name: 'No Vasculares', icon: IconOvalNonVasc, hex: THEME.blue, category: 'focal' },
  
  // Cirugías
  { id: 'bypass', name: 'Bypass', icon: IconBypass, hex: THEME.green, category: 'intervention' },
  { id: 'angioplasty', name: 'Angioplastia', icon: IconAngioplasty, hex: THEME.cyan, category: 'intervention' },
  { id: 'stent', name: 'Stent', icon: IconStent, hex: THEME.cyan, category: 'intervention' },
  { id: 'endarterectomy', name: 'Endarterectomía', icon: IconEndarterectomy, hex: THEME.green, category: 'intervention' },
  { id: 'saphenectomy', name: 'Safenectomía', icon: IconSaphenectomy, hex: THEME.green, category: 'intervention' },
  { id: 'foam_sclero', name: 'Escleroterapia', icon: IconFoam, hex: THEME.cyan, category: 'intervention' },
];

export const TOOLS_MAP = MASTER_TOOLS.reduce((acc, t) => ({ ...acc, [t.id]: t }), {});

export const DEFAULT_TOOL_GRIDS = {
  PIERNA: [
    'multiphasic', 'monophasic', 'tardus', 'occluded',
    'soft', 'calcified', 'stenosis_mild', 'stenosis_severe',
    'aneurysm', 'pseudo', 'occlusion', 'bypass', 'angioplasty', 'stent'
  ],
  CAROTIDA: [
    'low_res', 'high_res', 'inverted', 'tardus', 'occluded',
    'soft', 'calcified', 'ulcerated', 'gim',
    'stenosis_mild', 'stenosis_severe', 'occlusion',
    'stent', 'endarterectomy'
  ],
  VENOSO: [
    // Flujos Venosos (Página 1)
    'v_competent', 'v_incompetent', 'v_thrombosed', 'v_ablated',
    'v_continuous', 'v_pulsatile', 'v_hypoplastic', 'v_aplastic', 
    'v_adhesions', 'v_thickening', 'v_gulf', 
    // Focales y Cirugía (Página 2+)
    'perf_incompetent', 'varices', 'occlusion', 'v_ext_comp', 
    'oval_nerve', 'oval_ganglion', 'oval_nonvasc',
    'saphenectomy', 'foam_sclero'
  ]
};

// ============================================================================
// GEOMETRÍA SVG Y CÁLCULOS MATEMÁTICOS (ESTRUCTURA PURA)
// ============================================================================

export const parsePathData = (pathString) => {
  if (!pathString) return null;
  const matchL = pathString.match(/M\s+([0-9.\-]+)\s+([0-9.\-]+)\s+L\s+([0-9.\-]+)\s+([0-9.\-]+)/);
  if (matchL) return { type: 'L', coords: matchL.slice(1).map(Number) };
  
  const matchC = pathString.match(/M\s+([0-9.\-]+)\s+([0-9.\-]+)\s+C\s+([0-9.\-]+)\s+([0-9.\-]+),\s*([0-9.\-]+)\s+([0-9.\-]+),\s*([0-9.\-]+)\s+([0-9.\-]+)/);
  if (matchC) return { type: 'C', coords: matchC.slice(1).map(Number) };
  return null;
};

export const getPointsAlongParsedPath = (parsedPath, fractions) => {
  let points = [];
  if (!parsedPath) return points;

  if (parsedPath.type === 'L') {
    const [x1, y1, x2, y2] = parsedPath.coords;
    fractions.forEach(f => points.push({ x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, angle: Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) }));
  } else if (parsedPath.type === 'C') {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = parsedPath.coords;
    fractions.forEach(f => {
      const mt = 1 - f;
      const x = mt*mt*mt*x0 + 3*mt*mt*f*x1 + 3*mt*f*f*x2 + f*f*f*x3;
      const y = mt*mt*mt*y0 + 3*mt*mt*f*y1 + 3*mt*f*f*y2 + f*f*f*y3;
      const dx = 3*mt*mt*(x1-x0) + 6*mt*f*(x2-x1) + 3*f*f*(x3-x2);
      const dy = 3*mt*mt*(y1-y0) + 6*mt*f*(y2-y1) + 3*f*f*(y3-y2);
      points.push({ x, y, angle: Math.atan2(dy, dx) * (180 / Math.PI) });
    });
  }
  return points;
};

export const generateToolPath = (parsedPath, offset, isWavy, customWaves = 4) => {
  if (!parsedPath) return "";
  const steps = 30;
  const fractions = Array.from({length: steps + 1}, (_, i) => i / steps);
  const points = getPointsAlongParsedPath(parsedPath, fractions);
  if (points.length < 2) return "";
  let outPath = "";
  const amplitude = 3;
  for (let i = 0; i < points.length; i++) {
    let dx, dy;
    if (i < points.length - 1) { dx = points[i+1].x - points[i].x; dy = points[i+1].y - points[i].y; } 
    else { dx = points[i].x - points[i-1].x; dy = points[i].y - points[i-1].y; }
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const nx = -dy / len, ny = dx / len;
    let finalOffset = offset;
    if (isWavy) finalOffset += Math.sin((i/steps) * Math.PI * 2 * customWaves) * amplitude;
    outPath += i === 0 ? `M ${points[i].x + nx * finalOffset} ${points[i].y + ny * finalOffset}` : ` L ${points[i].x + nx * finalOffset} ${points[i].y + ny * finalOffset}`;
  }
  return outPath;
};

export const generateXPath = (parsedPath, width) => {
  if (!parsedPath) return "";
  const stepsCount = 10;
  const fractions = Array.from({length: stepsCount}, (_, i) => (i + 1) / (stepsCount + 1));
  const points = getPointsAlongParsedPath(parsedPath, fractions);
  let outPath = "";
  const size = width / 2; 
  points.forEach(pt => {
     const rad1 = (pt.angle + 45) * (Math.PI / 180);
     const rad2 = (pt.angle - 45) * (Math.PI / 180);
     const dx1 = Math.cos(rad1) * size, dy1 = Math.sin(rad1) * size;
     const dx2 = Math.cos(rad2) * size, dy2 = Math.sin(rad2) * size;
     outPath += `M ${pt.x - dx1} ${pt.y - dy1} L ${pt.x + dx1} ${pt.y + dy1} `;
     outPath += `M ${pt.x - dx2} ${pt.y - dy2} L ${pt.x + dx2} ${pt.y + dy2} `;
  });
  return outPath;
};

export const generateStitchesPath = (parsedPath, width) => {
  if (!parsedPath) return "";
  const steps = 8;
  const fractions = Array.from({length: steps}, (_, i) => (i + 1) / (steps + 1));
  const points = getPointsAlongParsedPath(parsedPath, fractions);
  let outPath = "";
  points.forEach(pt => {
     const rad = (pt.angle + 60) * (Math.PI / 180);
     const l = width / 2 + 3;
     const dx = Math.cos(rad) * l;
     const dy = Math.sin(rad) * l;
     outPath += `M ${pt.x - dx} ${pt.y - dy} L ${pt.x + dx} ${pt.y + dy} `;
  });
  return outPath;
};

export const generateCrossesPath = (parsedPath, width) => {
  if (!parsedPath) return "";
  const steps = 12;
  const fractions = Array.from({length: steps}, (_, i) => (i + 1) / (steps + 1));
  const points = getPointsAlongParsedPath(parsedPath, fractions);
  let outPath = "";
  points.forEach(pt => {
     const rad = (pt.angle + 90) * (Math.PI / 180); 
     const l = width / 2 + 2;
     const dx = Math.cos(rad) * l;
     const dy = Math.sin(rad) * l;
     outPath += `M ${pt.x - dx} ${pt.y - dy} L ${pt.x + dx} ${pt.y + dy} `;
  });
  return outPath;
};

// ============================================================================
// DATOS ANATÓMICOS (ESTRUCTURA PURA)
// ============================================================================

export const ARTERIAL_SEGMENTS = [
  { id: 'femoral_comun', name: 'Femoral Común', label: 'AFC', align: 'right', cdy: 0, type: 'macro', path: 'M 250 40 L 250 120', parentId: null },
  { id: 'femoral_profunda', name: 'Femoral Profunda', label: 'AFP', align: 'left', cdy: 0, type: 'branch', path: 'M 250 120 C 180 160, 160 260, 160 400', altBase: true, parentId: 'femoral_comun' },
  { id: 'afs_prox', name: 'AFS Proximal', label: 'AFS\nprox', align: 'right', cdy: 0, type: 'macro', path: 'M 250 120 L 250 240', altBase: true, parentId: 'femoral_comun' },
  { id: 'afs_med', name: 'AFS Media', label: 'AFS\nmed', align: 'right', cdy: 0, type: 'macro', path: 'M 250 240 L 250 380', parentId: 'afs_prox' },
  { id: 'afs_dist', name: 'AFS Distal', label: 'AFS\ndist', align: 'right', cdy: 0, type: 'macro', path: 'M 250 380 L 250 520', altBase: true, parentId: 'afs_med' },
  { id: 'pop_supra', name: 'Poplítea Supragenicular', label: 'POP\nsupra', align: 'right', cdy: 0, type: 'macro', path: 'M 250 520 L 250 580', parentId: 'afs_dist' },
  { id: 'pop_retro', name: 'Poplítea Retrogenicular', label: 'POP\nretro', align: 'right', offsetX: 50, cdy: 0, type: 'macro', path: 'M 250 580 L 250 640', altBase: true, parentId: 'pop_supra' },
  { id: 'pop_infra', name: 'Poplítea Infragenicular', label: 'POP\ninfra', align: 'right', cdy: 0, type: 'macro', path: 'M 250 640 L 250 700', parentId: 'pop_retro' },
  { id: 'tibial_ant', name: 'Tibial Anterior', label: 'ATA', align: 'right', cdy: 0, type: 'distal', path: 'M 250 700 C 310 740, 330 840, 330 940', altBase: true, parentId: 'pop_infra' },
  { id: 'tronco_tp', name: 'Tronco T-P', label: 'TTP', align: 'left', cdy: 0, type: 'macro', path: 'M 250 700 L 230 740', altBase: true, parentId: 'pop_infra' },
  { id: 'tibial_post', name: 'Tibial Posterior', label: 'ATP', align: 'left', cdy: 0, focalFraction: 0.3, type: 'distal', path: 'M 230 740 L 230 940', parentId: 'tronco_tp' },
  { id: 'peronea', name: 'Peronea', label: 'PER', align: 'left', cdy: 0, focalFraction: 0.7, type: 'distal', path: 'M 230 740 C 270 780, 280 870, 280 940', altBase: true, parentId: 'tronco_tp' },
  { id: 'pedia', name: 'Arteria Pedia', label: 'DP', align: 'right', cdy: 0, type: 'distal', path: 'M 330 940 L 330 990', parentId: 'tibial_ant' },
].map(seg => {
  const parsed = parsePathData(seg.path);
  return { ...seg, parsedPath: parsed, focalPoint: getPointsAlongParsedPath(parsed, [seg.focalFraction || 0.5])[0] || {x: 250, y: 0, angle: 0} };
});

export const CAROTID_SEGMENTS = [
  { id: 'subclavia', name: 'Arteria Subclavia', label: 'SUB', align: 'left', type: 'macro', path: 'M 100 850 L 350 850', altBase: true, parentId: null },
  { id: 'vertebral_prox', name: 'Vertebral Proximal', label: 'VERT\nprox', align: 'left', type: 'distal', path: 'M 160 850 L 160 550', parentId: 'subclavia' },
  { id: 'vertebral_dist', name: 'Vertebral Distal', label: 'VERT\ndist', align: 'left', focalFraction: 0.2, type: 'distal', path: 'M 160 550 L 160 250', altBase: true, parentId: 'vertebral_prox' },
  { id: 'cca_prox', name: 'Carótida Común Prox.', label: 'ACC\nprox', align: 'right', type: 'macro', path: 'M 300 850 L 300 650', altBase: true, parentId: null },
  { id: 'cca_dist', name: 'Carótida Común Dist.', label: 'ACC\ndist', align: 'right', type: 'macro', path: 'M 300 650 L 300 520', parentId: 'cca_prox' },
  { id: 'bulbo', name: 'Bulbo Carotídeo', label: 'BULBO', align: 'right', type: 'macro', path: 'M 300 520 C 275 485, 275 485, 300 450', altBase: true, parentId: 'cca_dist' },
  { id: 'ica_prox', name: 'Carótida Interna Prox.', label: 'ACI\nprox', align: 'right', type: 'macro', path: 'M 300 450 L 300 300', parentId: 'bulbo' },
  { id: 'ica_dist', name: 'Carótida Interna Dist.', label: 'ACI\ndist', align: 'right', type: 'macro', path: 'M 300 300 L 300 150', altBase: true, parentId: 'ica_prox' },
  { id: 'eca', name: 'Carótida Externa', label: 'ACE', align: 'left', focalFraction: 0.7, type: 'branch', path: 'M 300 500 C 230 450, 220 350, 220 150', parentId: 'bulbo' },
].map(seg => {
  const parsed = parsePathData(seg.path);
  return { ...seg, parsedPath: parsed, focalPoint: getPointsAlongParsedPath(parsed, [seg.focalFraction || 0.5])[0] || {x: 250, y: 0, angle: 0} };
});

export const VSM_SEGMENTS = [
  { id: 'sfj', name: 'Unión Safeno-Femoral', label: 'USF', align: 'right', type: 'macro', focalFraction: 0.05, cdy: 50, customRadius: 31, path: 'M 215 80 C 240 80, 250 110, 250 150', parentId: null },
  { id: 'v_epigastrica', name: 'V. Epigástrica Superficial', label: 'VES', align: 'left', type: 'branch', focalFraction: 0.8, cdy: 0, path: 'M 250 150 L 160 60', altBase: true, parentId: 'sfj' },
  { id: 'v_pudenda', name: 'V. Pudenda Externa', label: 'VPE', align: 'left', type: 'branch', focalFraction: 0.8, cdy: -2, path: 'M 250 150 L 170 150', altBase: true, parentId: 'sfj' },
  { id: 'v_circunfleja', name: 'V. Circunfleja Ilíaca Superf.', label: 'VCIS', align: 'right', type: 'branch', focalFraction: 0.8, cdy: 0, path: 'M 250 150 L 260 20', altBase: true, parentId: 'sfj' },
  { id: 'vsm_muslo_prox', name: 'VSM Muslo Proximal', label: 'VSM\nProx', align: 'right', type: 'macro', path: 'M 250 150 L 250 300', parentId: 'sfj' },
  { id: 'vsaa', name: 'V. Safena Accesoria Anterior', label: 'VSAA', align: 'left', type: 'branch', focalFraction: 0.4, path: 'M 250 150 C 180 200, 180 350, 200 450', altBase: true, parentId: 'vsm_muslo_prox' },
  { id: 'vsap', name: 'V. Safena Accesoria Posterior', label: 'VSAP', align: 'right', type: 'branch', focalFraction: 0.4, cdy: 0, path: 'M 250 201 C 320 251, 320 401, 300 501', altBase: true, parentId: 'vsm_muslo_prox' },
  { id: 'vsm_muslo_med', name: 'VSM Muslo Media', label: 'VSM\nMed', align: 'right', type: 'macro', path: 'M 250 300 L 250 450', parentId: 'vsm_muslo_prox' },
  { id: 'perf_hunter', name: 'Perf. Muslo (Hunter)', label: 'Perf\nHunter', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 400 L 220 400', altBase: true, parentId: 'vsm_muslo_med', isPerforator: true },
  { id: 'vsm_muslo_dist', name: 'VSM Muslo Distal', label: 'VSM\nDist', align: 'right', type: 'macro', path: 'M 250 450 L 250 600', parentId: 'vsm_muslo_med' },
  { id: 'perf_dodd', name: 'Perf. Muslo (Dodd)', label: 'Perf\nDodd', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 550 L 220 550', altBase: true, parentId: 'vsm_muslo_dist', isPerforator: true },
  { id: 'vsm_pierna_prox', name: 'VSM Pierna Proximal', label: 'VSM\nPierna P', align: 'right', type: 'macro', path: 'M 250 600 L 250 700', parentId: 'vsm_muslo_dist' },
  { id: 'perf_boyd', name: 'Perf. Pierna (Boyd)', label: 'Perf\nBoyd', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 650 L 220 650', altBase: true, parentId: 'vsm_pierna_prox', isPerforator: true },
  { id: 'vsm_pierna_med', name: 'VSM Pierna Media', label: 'VSM\nPierna M', align: 'right', type: 'macro', path: 'M 250 700 L 250 800', parentId: 'vsm_pierna_prox' },
  { id: 'perf_cockett_sup', name: 'Perf. Cockett Sup.', label: 'Cockett\nSup', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 750 L 220 750', altBase: true, parentId: 'vsm_pierna_med', isPerforator: true },
  { id: 'vsm_pierna_dist', name: 'VSM Pierna Distal', label: 'VSM\nPierna D', align: 'right', type: 'macro', path: 'M 250 800 L 250 950', parentId: 'vsm_pierna_med' },
  { id: 'perf_cockett_inf', name: 'Perf. Cockett Inf.', label: 'Cockett\nInf', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 880 L 220 880', altBase: true, parentId: 'vsm_pierna_dist', isPerforator: true },
].map(seg => {
  const parsed = parsePathData(seg.path);
  return { ...seg, parsedPath: parsed, focalPoint: getPointsAlongParsedPath(parsed, [seg.focalFraction || 0.5])[0] || {x: 250, y: 0, angle: 0} };
});

export const VSP_SEGMENTS = [
  { id: 'usp', name: 'Unión Safeno-Poplítea', label: 'USP', align: 'right', type: 'macro', focalFraction: 0.05, cdy: 50, customRadius: 31, path: 'M 215 250 C 240 250, 250 280, 250 320', parentId: null },
  { id: 'ext_craneal', name: 'Extensión Craneal (V. Giacomini)', label: 'Ext.\nCraneal', align: 'right', type: 'branch', focalFraction: 0.7, cdy: 0, path: 'M 250 320 C 250 280, 260 200, 260 100', altBase: true, parentId: 'usp' },
  { id: 'v_gemelar', name: 'Venas Gemelares', label: 'V.\nGemelar', align: 'left', type: 'branch', focalFraction: 0.5, cdy: 0, path: 'M 215 248 C 180 268, 160 368, 160 468', altBase: true, parentId: 'usp' },
  { id: 'vsp_prox', name: 'VSP Proximal', label: 'VSP\nProx', align: 'right', type: 'macro', path: 'M 250 320 L 250 480', parentId: 'usp' },
  { id: 'perf_poplitea', name: 'Perforante Poplítea', label: 'Perf\nPoplítea', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 400 L 220 400', altBase: true, parentId: 'vsp_prox', isPerforator: true },
  { id: 'v_intersafena', name: 'Vena Intersafena', label: 'V.\nIntersaf.', align: 'right', type: 'branch', focalFraction: 0.6, cdy: 0, path: 'M 250 500 C 300 500, 340 450, 380 450', altBase: true, parentId: 'vsp_prox' },
  { id: 'vsp_med', name: 'VSP Media', label: 'VSP\nMed', align: 'right', type: 'macro', path: 'M 250 480 L 250 680', parentId: 'vsp_prox' },
  { id: 'perf_post', name: 'Perforante Posterior (Gemelar)', label: 'Perf\nPost.', align: 'left', type: 'distal', focalFraction: 0.9, path: 'M 250 580 L 220 580', altBase: true, parentId: 'vsp_med', isPerforator: true },
  { id: 'vsp_dist', name: 'VSP Distal', label: 'VSP\nDist', align: 'right', type: 'macro', path: 'M 250 680 L 250 880', parentId: 'vsp_med' },
].map(seg => {
  const parsed = parsePathData(seg.path);
  return { ...seg, parsedPath: parsed, focalPoint: getPointsAlongParsedPath(parsed, [seg.focalFraction || 0.5])[0] || {x: 250, y: 0, angle: 0} };
});

export const SVP_SEGMENTS = [
  { id: 'vfc', name: 'Vena Femoral Común', label: 'VFC', align: 'right', cdy: 0, type: 'macro', path: 'M 250 40 L 250 120', parentId: null },
  { id: 'vfp', name: 'Vena Femoral Profunda', label: 'VFP', align: 'left', cdy: 0, type: 'branch', path: 'M 250 120 C 180 160, 160 260, 160 400', altBase: true, parentId: 'vfc' },
  { id: 'vf_prox', name: 'Vena Femoral Proximal', label: 'VF\nprox', align: 'right', cdy: 0, type: 'macro', path: 'M 250 120 L 250 240', altBase: true, parentId: 'vfc' },
  { id: 'vf_med', name: 'Vena Femoral Media', label: 'VF\nmed', align: 'right', cdy: 0, type: 'macro', path: 'M 250 240 L 250 380', parentId: 'vf_prox' },
  { id: 'vf_dist', name: 'Vena Femoral Distal', label: 'VF\ndist', align: 'right', cdy: 0, type: 'macro', path: 'M 250 380 L 250 520', altBase: true, parentId: 'vf_med' },
  { id: 'v_pop_supra', name: 'V. Poplítea Supragenicular', label: 'POP\nsupra', align: 'right', cdy: 0, type: 'macro', path: 'M 250 520 L 250 580', parentId: 'vf_dist' },
  { id: 'v_pop_retro', name: 'V. Poplítea Retrogenicular', label: 'POP\nretro', align: 'right', offsetX: 50, cdy: 0, type: 'macro', path: 'M 250 580 L 250 640', altBase: true, parentId: 'v_pop_supra' },
  { id: 'v_gemelares', name: 'Venas Gemelares', label: 'VV\nGemelares', align: 'left', cdy: 0, type: 'branch', focalFraction: 0.5, path: 'M 250 570 C 180 600, 170 690, 170 790', altBase: true, parentId: 'v_pop_supra' },
  { id: 'v_pop_infra', name: 'V. Poplítea Infragenicular', label: 'POP\ninfra', align: 'right', cdy: 0, type: 'macro', path: 'M 250 640 L 250 700', parentId: 'v_pop_retro' },
  { id: 'v_tibial_ant', name: 'Venas Tibiales Anteriores', label: 'VTA', align: 'right', cdy: 0, type: 'distal', path: 'M 250 700 C 310 740, 330 840, 330 940', altBase: true, parentId: 'v_pop_infra' },
  { id: 'tronco_tp_v', name: 'Tronco Tibio-Peroneo Venoso', label: 'TTP', align: 'left', cdy: 0, type: 'macro', path: 'M 250 700 L 230 740', altBase: true, parentId: 'v_pop_infra' },
  { id: 'v_tibial_post', name: 'Venas Tibiales Posteriores', label: 'VTP', align: 'left', cdy: 0, focalFraction: 0.385, type: 'distal', path: 'M 230 740 L 230 940', parentId: 'tronco_tp_v' },
  { id: 'v_peronea', name: 'Venas Peroneas', label: 'V.PER', align: 'right', cdy: 0, focalFraction: 0.77, type: 'distal', path: 'M 230 740 C 270 780, 280 870, 280 940', altBase: true, parentId: 'tronco_tp_v' },
  { id: 'v_soleales', name: 'Venas Soleales', label: 'VV\nSoleales', align: 'left', cdy: 0, type: 'branch', focalFraction: 0.8, path: 'M 230 790 C 180 820, 160 870, 160 920', altBase: true, parentId: 'v_tibial_post' },
].map(seg => {
  const parsed = parsePathData(seg.path);
  return { ...seg, parsedPath: parsed, focalPoint: getPointsAlongParsedPath(parsed, [seg.focalFraction || 0.5])[0] || {x: 250, y: 0, angle: 0} };
});

// ============================================================================
// SOLUCIÓN DE RENDIMIENTO 1: ENTRADAS DE TEXTO LOCALES (NO LAG)
// ============================================================================
export const SmartInput = ({ value, onChange, placeholder, className, style, type="text", step, inputMode }) => {
    const [localVal, setLocalVal] = useState(value || '');
    
    useEffect(() => { setLocalVal(value || ''); }, [value]);

    return (
        <input 
            type={type} 
            step={step} 
            inputMode={inputMode}
            value={localVal} 
            onChange={e => setLocalVal(e.target.value)} 
            onBlur={() => { if (localVal !== (value || '')) onChange(localVal); }} 
            placeholder={placeholder} 
            className={className} 
            style={style} 
        />
    );
};
