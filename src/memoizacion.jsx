import React, { useState } from 'react';

import { THEME, hexToRgba, TOOLS_MAP, DEFAULT_TOOL_GRIDS, SmartInput, IconVarices, ARTERIAL_SEGMENTS, CAROTID_SEGMENTS, VSM_SEGMENTS, VSP_SEGMENTS, SVP_SEGMENTS, parsePathData, getPointsAlongParsedPath, generateToolPath, generateXPath, generateStitchesPath, generateCrossesPath } from './constants.jsx';
import { Activity, Eraser, MousePointerClick, AlertTriangle, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Droplet, Zap, Sparkles, Copy, X, Plus, CornerUpLeft, Settings2, Save } from 'lucide-react';
import { SidebarLeft, calculateSegmentStyle } from './renderizado';

// ============================================================================
// SOLUCIÓN DE RENDIMIENTO 2: SEGMENT LAYER (MEMOIZACIÓN EXTREMA + POINTER EVENTS)
// ============================================================================
export const SegmentLayer = React.memo(({ segment, sState }) => {
    const style = calculateSegmentStyle(segment, sState);
    if (!style.isMapped) return null;

    const { colorHex, width, pared, focal, hasColor, interventions, sStateColor } = style;
    const isCalcified = pared.includes('calcified'), isSoft = pared.includes('soft'), isUlcerated = pared.includes('ulcerated'), isGIM = pared.includes('gim');
    const isBypass = interventions.includes('bypass'), isAngioplasty = interventions.includes('angioplasty'), isStent = interventions.includes('stent'), isEndarterectomy = interventions.includes('endarterectomy');
    const isHypoplastic = pared.includes('v_hypoplastic'), isAplastic = pared.includes('v_aplastic'), isThickened = pared.includes('v_thickening'), hasAdhesions = pared.includes('v_adhesions'), isGulf = pared.includes('v_gulf');
    const isSaphenectomy = interventions.includes('saphenectomy'), isFoam = interventions.includes('foam_sclero');

    let strokeColor = colorHex;
    const isAblated = sStateColor === 'v_ablated';
    const isThrombosed = sStateColor === 'v_thrombosed';
    if (isThrombosed) strokeColor = '#000000'; 
    if (isAblated) strokeColor = THEME.grey;
    if (isHypoplastic || isAplastic) strokeColor = '#FFFFFF'; 

    let dashArray = "none";
    let lineCap = "round";
    let baseStrokeWidth = width;

    if (isHypoplastic) {
        dashArray = "4 16"; 
        baseStrokeWidth = 3; 
    } else if (isAplastic) {
        dashArray = "0.1 12"; 
        lineCap = "round";
        baseStrokeWidth = width - 4;
    }

    let wallIndex = 0;
    const getOffset = () => width/2 + 2 + (wallIndex * 5);

    return (
      <g key={`render-${segment.id}`} className="pointer-events-none">
        
        {!isSaphenectomy && (
            <path 
                d={segment.path} fill="none" 
                stroke={strokeColor} 
                strokeWidth={baseStrokeWidth} 
                strokeLinecap={lineCap} strokeDasharray={dashArray} 
                filter={(isThrombosed || isAblated) ? `drop-shadow(0 0 2px rgba(255,255,255,0.6))` : `drop-shadow(0 0 6px ${hexToRgba(colorHex, 0.5)})`} 
            />
        )}

        {isAngioplasty && (
          <g opacity="0.9">
            <path d={generateToolPath(segment.parsedPath, width/2 + 3, false)} fill="none" stroke="#FFF" strokeWidth={1.5} />
            <path d={generateToolPath(segment.parsedPath, -width/2 - 3, false)} fill="none" stroke="#FFF" strokeWidth={1.5} />
          </g>
        )}

        {isStent && <path d={segment.path} fill="none" stroke="#FFFFFF" strokeWidth={width+4} strokeDasharray="2 3" opacity="0.8" />}
        {isEndarterectomy && <path d={generateStitchesPath(segment.parsedPath, width)} fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity="0.9" />}

        {isGulf && (() => {
           const points = getPointsAlongParsedPath(segment.parsedPath, [0.3, 0.5, 0.7]);
           return (
               <g>
                   <path d={segment.path} fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
                   {points.map((pt, i) => (
                        <g key={`gulf-${i}`} transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle})`}>
                             <circle cx="0" cy="0" r={width * 0.8} fill={strokeColor} stroke="#FFFFFF" strokeWidth="2" filter={`drop-shadow(0 0 4px ${hexToRgba(strokeColor, 0.6)})`} />
                        </g>
                   ))}
               </g>
           );
        })()}

        {isGIM && (() => {
          const off = getOffset(); wallIndex++;
          return (
            <g key="gim" opacity="0.8">
              <path d={generateToolPath(segment.parsedPath, off, false)} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
              <path d={generateToolPath(segment.parsedPath, -off, false)} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
            </g>
          );
        })()}

        {(isSoft || isUlcerated) && (() => {
          const off = getOffset(); wallIndex++;
          return (
            <g key="soft" opacity="0.6">
              <path d={generateToolPath(segment.parsedPath, off, true)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeDasharray={isUlcerated ? "6 8" : "none"} />
              <path d={generateToolPath(segment.parsedPath, -off, true)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeDasharray={isUlcerated ? "6 8" : "none"} />
            </g>
          );
        })()}

        {isCalcified && (() => {
          const off = getOffset(); wallIndex++;
          return (
            <g key="calcified" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.9))">
              <path d={generateToolPath(segment.parsedPath, off, true)} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeDasharray="1 6" />
              <path d={generateToolPath(segment.parsedPath, -off, true)} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeDasharray="1 6" />
            </g>
          );
        })()}

        {isThickened && (() => {
          const off = width / 2;
          return (
            <g key="thick" opacity="0.9">
              <path d={generateToolPath(segment.parsedPath, off, false)} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
              <path d={generateToolPath(segment.parsedPath, -off, false)} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
            </g>
          );
        })()}

        {hasAdhesions && (
            <path key="adhesions" d={generateXPath(segment.parsedPath, width)} fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" filter="drop-shadow(0 0 2px rgba(0,0,0,0.8))" />
        )}

        {isFoam && (() => {
            const pt = segment.focalPoint;
            return (
                <g key={`foam`} transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle - 60}) scale(1.2)`}>
                    <g filter="drop-shadow(0 2px 2px rgba(0,0,0,0.8))">
                        <rect x="-2" y="-16" width="4" height="10" rx="1" fill={THEME.bgApp} stroke="#FFF" strokeWidth="1.5"/>
                        <path d="M 0 -6 L 0 0" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M -2 -20 L 2 -20 M 0 -20 L 0 -16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="-4" y1="-16" x2="4" y2="-16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="-2" y1="-13" x2="0" y2="-13" stroke="#FFF" strokeWidth="1"/>
                        <line x1="-2" y1="-10" x2="0" y2="-10" stroke="#FFF" strokeWidth="1"/>
                    </g>
                    <circle cx="2" cy="1" r="1.5" fill="#FFF" />
                    <circle cx="-1" cy="3" r="1" fill="#FFF" />
                </g>
            );
        })()}

        {isBypass && (
           <path d={generateToolPath(segment.parsedPath, width/2 + 16, false)} fill="none" stroke={hasColor ? colorHex : THEME.green} strokeWidth={width-2} strokeDasharray="8 4" filter={`drop-shadow(0 0 4px ${hexToRgba(hasColor ? colorHex : THEME.green, 0.4)})`} />
        )}
        
        {isSaphenectomy && (
            <g filter="drop-shadow(0 0 2px rgba(0,0,0,0.8))">
                <path d={segment.path} fill="none" stroke={THEME.green} strokeWidth="2.5" />
                <path d={generateCrossesPath(segment.parsedPath, width)} fill="none" stroke={THEME.green} strokeWidth="2.5" strokeLinecap="round" />
            </g>
        )}

        {focal.map((fId, idx) => {
           const spacingX = 38; 
           const maxPerLine = 3;
           const lineIdx = Math.floor(idx / maxPerLine);
           const posInLine = idx % maxPerLine;

           const offsetX = posInLine === 0 ? 0 : (posInLine === 1 ? spacingX : -spacingX);
           const offsetY = lineIdx * (width + 20); 

           const W = width / 2;

           return (
               <g key={fId} transform={`translate(${segment.focalPoint.x}, ${segment.focalPoint.y}) rotate(${segment.focalPoint.angle}) translate(${offsetX}, ${offsetY})`}>
                  
                  <g transform="scale(1.15)">
                      {fId === 'stenosis_mild' && (
                         <g>
                            <rect x="-12" y={-W - 2} width="24" height={W * 2 + 4} fill={THEME.bgApp} />
                            <path d={`M -12 ${-W} L -5 ${-W} C 0 ${-W + 4}, 0 ${-W + 4}, 5 ${-W} L 12 ${-W}`} fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                            <path d={`M -12 ${W} L -5 ${W} C 0 ${W - 4}, 0 ${W - 4}, 5 ${W} L 12 ${W}`} fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                            <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" />
                         </g>
                      )}
                      
                      {fId === 'stenosis_severe' && (
                         <g>
                            <rect x="-12" y={-W - 2} width="24" height={W * 2 + 4} fill={THEME.bgApp} />
                            <path d={`M -12 ${-W} L -4 ${-W} L 0 -1 L 4 ${-W} L 12 ${-W}`} fill="none" stroke={THEME.red} strokeWidth="2" strokeLinejoin="round" />
                            <path d={`M -12 ${W} L -4 ${W} L 0 1 L 4 ${W} L 12 ${W}`} fill="none" stroke={THEME.red} strokeWidth="2" strokeLinejoin="round" />
                            <polygon points={`-4,${-W-5} 4,${-W-5} 0,${-W}`} fill={THEME.red} />
                            <polygon points={`-4,${W+5} 4,${W+5} 0,${W}`} fill={THEME.red} />
                         </g>
                      )}

                      {fId === 'aneurysm' && (
                         <g>
                            <rect x="-14" y={-W - 2} width="28" height={W * 2 + 4} fill={THEME.bgApp} />
                            <ellipse cx="0" cy="0" rx="14" ry={W + 5} fill={THEME.bgApp} stroke="#FFF" strokeWidth="2" />
                            <line x1="-14" y1="0" x2="14" y2="0" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
                         </g>
                      )}
                      
                      {fId === 'pseudo' && (
                         <g>
                            <circle cx="0" cy={-W - 15} r="11" fill={THEME.bgApp} stroke="#FFF" strokeWidth="2" />
                            <line x1="0" y1={-W} x2="0" y2={-W - 4} stroke="#FFF" strokeWidth="2" />
                         </g>
                      )}
                      
                      {fId === 'occlusion' && (() => {
                         const R = W * 0.9; 
                         return (
                             <g>
                                <path d={`M ${-2*R} ${W} A ${R} ${R} 0 0 1 0 ${W} Z`} fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d={`M 0 ${W} A ${R} ${R} 0 0 1 ${2*R} ${W} Z`} fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
                             </g>
                         );
                      })()}

                      {fId === 'v_ext_comp' && (
                         <g filter="drop-shadow(0 2px 3px rgba(0,0,0,0.8))">
                             <path d={`M -6 ${-W - 12} L 0 ${-W - 3} L 6 ${-W - 12}`} fill="none" stroke={THEME.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                             <line x1="0" y1={-W - 12} x2="0" y2={-W - 3} stroke={THEME.orange} strokeWidth="3" strokeLinecap="round"/>
                             <path d={`M -6 ${W + 12} L 0 ${W + 3} L 6 ${W + 12}`} fill="none" stroke={THEME.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                             <line x1="0" y1={W + 12} x2="0" y2={W + 3} stroke={THEME.orange} strokeWidth="3" strokeLinecap="round"/>
                         </g>
                      )}
                      
                      {fId === 'v_pulsatile' && (
                         <g transform={`translate(0, ${-W - 14}) scale(0.7)`} filter="drop-shadow(0 2px 2px rgba(0,0,0,0.8))">
                            <path d="M 12 21.35 l -1.45 -1.32 C 5.4 15.36 2 12.28 2 8.5 C 2 5.42 4.42 3 7.5 3 c 1.74 0 3.41 0.81 4.5 2.09 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.42 22 8.5 c 0 3.78 -3.4 6.86 -8.55 11.54 L 12 21.35 z" fill={THEME.bgApp} stroke={THEME.cyan} strokeWidth="2.5" transform="translate(-12, -12)"/>
                            <path d="M -7 0 L -3 0 L -1 -5 L 1 5 L 3 0 L 7 0" stroke={THEME.cyan} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                         </g>
                      )}
                      
                      {fId === 'v_continuous' && (
                         <g transform={`translate(0, ${-W - 14}) scale(0.7)`} filter="drop-shadow(0 2px 2px rgba(0,0,0,0.8))">
                            <rect x="-12" y="-10" width="24" height="20" rx="4" fill={THEME.bgApp} stroke={THEME.cyan} strokeWidth="2" />
                            <line x1="-8" y1="-2" x2="8" y2="-2" stroke={THEME.cyan} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="-8" y1="4" x2="8" y2="4" stroke={THEME.cyan} strokeWidth="1.5" strokeDasharray="2 3" strokeLinecap="round"/>
                         </g>
                      )}
                      
                      {fId === 'oval_nerve' && <ellipse cx="0" cy={-W - 12} rx="10" ry="6" fill={THEME.yellow} stroke="#FFF" strokeWidth="1.5" />}
                      {fId === 'oval_ganglion' && <ellipse cx="0" cy={-W - 12} rx="10" ry="6" fill={THEME.green} stroke="#FFF" strokeWidth="1.5" />}
                      {fId === 'oval_nonvasc' && <ellipse cx="0" cy={-W - 12} rx="10" ry="6" fill={THEME.blue} stroke="#FFF" strokeWidth="1.5" />}
                      
                      {fId === 'perf_incompetent' && segment.isPerforator && (
                         <g transform="translate(0, 4) scale(0.9)">
                            <circle cx="0" cy="0" r="8" fill={THEME.bgApp} stroke={THEME.red} strokeWidth="2.5" />
                            <line x1="0" y1="0" x2="0" y2="10" stroke={THEME.red} strokeWidth="2.5" />
                            <polyline points="-4,6 0,10 4,6" fill="none" stroke={THEME.red} strokeWidth="2.5" />
                         </g>
                      )}
                  </g>
               </g>
           );
        })}
      </g>
    );
}, (prev, next) => prev.sState === next.sState);


export const MapCanvas = ({ state, actions }) => {
  const { activeSystem, cartography, leg, activeElement, currentSegments, activeSegmentDetails, isLeftHanded, arteryStates } = state;
  const { handleSegmentClick, switchSystem, switchCartography, setLeg } = actions;
  
  const activeIdentityColor = leg === 'DERECHA' ? THEME.cyan : THEME.orange;

  return (
    <main className="flex-1 relative overflow-hidden flex flex-col min-w-0 touch-none overscroll-none" style={{ backgroundImage: `linear-gradient(to top, ${THEME.bgApp}F2 0%, ${THEME.bgApp}40 50%, ${THEME.bgApp}00 100%)` }}>
      
      {/* CABECERA GLOBAL MINIMALISTA (CERO SCROLL, MÁXIMA ELEGANCIA) */}
      <div className="h-14 px-4 shrink-0 flex items-center justify-center z-20 relative w-full" style={{ backgroundColor: THEME.bgSidebar, borderBottom: `1px solid ${THEME.border}` }}>
        
        <div className="flex items-center gap-4 md:gap-6 bg-[#1a1a1a] px-3 py-1.5 rounded-2xl border border-white/5 shadow-inner">
            
            {/* SISTEMA (Círculos Rojo/Azul puros) */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => switchSystem('ARTERIAL')} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${activeSystem === 'ARTERIAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] scale-110 border-2 border-red-300' : 'bg-red-500/20 hover:bg-red-500/40 border border-transparent'}`}
                    title="Sistema Arterial"
                />
                <button 
                    onClick={() => switchSystem('VENOSO')} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${activeSystem === 'VENOSO' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)] scale-110 border-2 border-blue-300' : 'bg-blue-500/20 hover:bg-blue-500/40 border border-transparent'}`}
                    title="Sistema Venoso"
                />
            </div>

            <div className="w-px h-5 bg-white/10"></div>

            {/* TERRITORIO (Textos compactos minimalistas) */}
            <div className="flex items-center gap-1">
                {activeSystem === 'ARTERIAL' ? (
                    <>
                        <button onClick={() => switchCartography('PIERNA')} className={`px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black tracking-wide transition-all ${cartography === 'PIERNA' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}>MM.II.</button>
                        <button onClick={() => switchCartography('CAROTIDA')} className={`px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black tracking-wide transition-all ${cartography === 'CAROTIDA' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}>Carótida</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => switchCartography('VSM')} className={`px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black tracking-wide transition-all ${cartography === 'VSM' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}>Magna</button>
                        <button onClick={() => switchCartography('VSP')} className={`px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black tracking-wide transition-all ${cartography === 'VSP' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}>Parva</button>
                        <button onClick={() => switchCartography('SVP')} className={`px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black tracking-wide transition-all ${cartography === 'SVP' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-gray-300'}`}>Profundo</button>
                    </>
                )}
            </div>

            <div className="w-px h-5 bg-white/10"></div>

            {/* LATERALIDAD (D / I Universales) */}
            <div className="flex items-center gap-1.5">
                <button 
                    onClick={() => setLeg('DERECHA')} 
                    className={`w-7 h-7 rounded-lg text-[13px] font-black transition-all flex items-center justify-center ${leg === 'DERECHA' ? 'bg-cyan-500 text-white shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-black/30 text-gray-500 hover:text-gray-300'}`}
                >
                    D
                </button>
                <button 
                    onClick={() => setLeg('IZQUIERDA')} 
                    className={`w-7 h-7 rounded-lg text-[13px] font-black transition-all flex items-center justify-center ${leg === 'IZQUIERDA' ? 'bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-black/30 text-gray-500 hover:text-gray-300'}`}
                >
                    I
                </button>
            </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none flex justify-between items-start pt-24 px-5 z-0 overflow-hidden">
        <div 
          className="font-black uppercase tracking-[0.25em] select-none transition-all duration-700 ease-out"
          style={{ writingMode: 'vertical-rl', fontSize: '72px', color: THEME.cyan, opacity: leg === 'DERECHA' ? 0.08 : 0, transform: leg === 'DERECHA' ? 'rotate(180deg) translateY(0)' : 'rotate(180deg) translateY(20px)' }}
        >DERECHA</div>
        <div 
          className="font-black uppercase tracking-[0.25em] select-none transition-all duration-700 ease-out"
          style={{ writingMode: 'vertical-rl', fontSize: '72px', color: THEME.orange, opacity: leg === 'IZQUIERDA' ? 0.08 : 0, transform: leg === 'IZQUIERDA' ? 'rotate(180deg) translateY(0)' : 'rotate(180deg) translateY(20px)' }}
        >IZQUIERDA</div>
      </div>

      <svg viewBox="0 0 500 1000" className="absolute inset-0 w-full h-full block mt-16 z-10" preserveAspectRatio="xMidYMid meet">
        {arteryStates.GLOBAL?.varices && (
            <g transform={`translate(${isLeftHanded ? 380 : 120}, 250)`} className="pointer-events-none animate-in fade-in zoom-in duration-300">
                <rect x="-60" y="-35" width="120" height="70" rx="12" fill={THEME.bgSurface} stroke={THEME.cyan} strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.8))" opacity="0.95" />
                <text x="0" y="-18" fill={THEME.cyan} fontSize="9" textAnchor="middle" fontWeight="900" letterSpacing="1">VARICES / COLAT.</text>
                <g transform="translate(0, 4) scale(0.9)">
                    <path d="M -12 -12 C 0 -6, -12 0, 0 6 C 6 9, -6 14, -2 18" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
                    <path d="M -6 -4 C 2 -6, 4 0, 8 -2" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                </g>
                <text x="0" y="24" fill={THEME.textMain} fontSize="8" textAnchor="middle" fontWeight="bold">
                    {(arteryStates.GLOBAL.varices_loc || "Ubicación pendiente").substring(0, 18)}{(arteryStates.GLOBAL.varices_loc?.length > 18 ? "..." : "")}
                </text>
            </g>
        )}

        <g transform={isLeftHanded ? "translate(500, 0) scale(-1, 1)" : ""}>
          {/* LÍNEAS DE CONEXIÓN */}
          {currentSegments.map(segment => {
            const mirrorX = (x) => leg === 'IZQUIERDA' ? 500 - x : x;
            const focalX = mirrorX(segment.focalPoint.x);
            const focalY = segment.focalPoint.y;
            const baseCircleX = segment.align === 'right' ? 420 + (segment.offsetX || 0) : 80 - (segment.offsetX || 0);
            const circleX = mirrorX(baseCircleX);
            const circleY = segment.focalPoint.y + (segment.cdy || 0);
            return <line key={`line-${segment.id}`} x1={focalX} y1={focalY} x2={circleX} y2={circleY} stroke={THEME.textMuted} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" className="pointer-events-none" />;
          })}

          <g transform={leg === 'IZQUIERDA' ? "translate(500, 0) scale(-1, 1)" : ""}>
            {cartography === 'VSM' && <path d="M 215 30 L 215 160" fill="none" stroke={THEME.blue} strokeWidth="26" strokeOpacity="0.15" strokeLinecap="round" className="pointer-events-none" />}
            {cartography === 'VSP' && <path d="M 215 150 L 215 350" fill="none" stroke={THEME.blue} strokeWidth="26" strokeOpacity="0.15" strokeLinecap="round" className="pointer-events-none" />}

            {/* BASE ANATÓMICA FANTASMA */}
            <g opacity="0.6" className="pointer-events-none">
              {currentSegments.map(segment => <path key={`base-${segment.id}`} d={segment.path} fill="none" stroke={segment.altBase ? THEME.unmappedAlt : THEME.unmapped} strokeWidth={segment.type === 'macro' ? 12 : (segment.type === 'branch' ? 10 : 8)} strokeLinecap="round" />)}
            </g>

            {activeSegmentDetails && <path d={activeSegmentDetails.path} fill="none" stroke="#FFFFFF" strokeWidth={32} strokeOpacity="0.1" strokeLinecap="round" className="pointer-events-none" />}

            {/* RENDERIZADO MATEMÁTICO AISLADO Y MEMOIZADO PARA RENDIMIENTO EXTREMO */}
            {currentSegments.map(segment => (
                 <SegmentLayer key={`render-${segment.id}`} segment={segment} sState={arteryStates[segment.id]} />
            ))}
          </g>

          {/* NODOS DE INTERACCIÓN (HITNODES) */}
          {currentSegments.map(segment => {
            const isSelected = activeElement?.id === segment.id;
            const style = calculateSegmentStyle(segment, arteryStates[segment.id]);
            const labelLines = segment.label.split('\n');

            const mirrorX = (x) => leg === 'IZQUIERDA' ? 500 - x : x;
            const circleX = mirrorX(segment.align === 'right' ? 420 + (segment.offsetX || 0) : 80 - (segment.offsetX || 0));
            const circleY = segment.focalPoint.y + (segment.cdy || 0);
            const circleRadius = segment.customRadius || 26; 

            const isRightSideVisually = circleX > 250;
            const textX = isRightSideVisually ? circleX + circleRadius + 8 : circleX - circleRadius - 8;
            const textAnchor = isLeftHanded ? (isRightSideVisually ? 'end' : 'start') : (isRightSideVisually ? 'start' : 'end');

            const allLines = labelLines.map(t => ({ text: t, isTitle: true }));
            const startY = circleY - ((allLines.length - 1) * 12) / 2;

            return (
              <g key={`hitnode-${segment.id}`}>
                <g transform={isLeftHanded ? `translate(${circleX * 2}, 0) scale(-1, 1)` : ""}>
                  <g className="cursor-pointer transition-all duration-200" style={{ transformOrigin: `${circleX}px ${circleY}px`, transform: isSelected ? 'scale(1.05)' : 'scale(1)' }} onClick={() => handleSegmentClick(segment.id)}>
                    
                    {/* Atrapadedos invisible de 44px (Estándar UI Táctil Apple) */}
                    <circle cx={circleX} cy={circleY} r={44} fill="transparent" />

                    <circle cx={circleX} cy={circleY} r={circleRadius} fill={THEME.bgSurface} stroke={style.isMapped ? style.colorHex : (isSelected ? activeIdentityColor : THEME.border)} strokeWidth={isSelected ? 3 : 1.5} filter={isSelected ? `drop-shadow(0 0 8px ${hexToRgba(style.isMapped ? style.colorHex : activeIdentityColor, 0.5)})` : ''} />
                    {style.isMapped && <circle cx={circleX} cy={circleY} r={circleRadius - 3} fill={style.colorHex} opacity="0.1" className="pointer-events-none" />}

                    <text x={textX} y={circleY} textAnchor={textAnchor} className="font-sans pointer-events-none" transform={isLeftHanded ? `scale(-1, 1) translate(${-textX * 2}, 0)` : ""}>
                      {allLines.map((lineObj, i) => (
                         <tspan 
                            key={i} x={circleX} y={startY + (i * 12)} 
                            fontSize={i === 0 ? "11" : "9"} 
                            fontWeight="800" 
                            fill={style.isMapped ? THEME.textMain : THEME.textMuted}
                            textAnchor="middle"
                            className="tracking-widest"
                         >
                            {lineObj.text}
                         </tspan>
                      ))}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </main>
  );
};

export const SidebarRight = ({ state, actions }) => {
  const { activeSystem, cartography, leg, activeElement, isLeftHanded, arteryStates, activeSegmentDetails, currentSegments } = state;
  const { handleSegmentClick, generateAIReport, isGeneratingReport } = actions;

  const handlePrevSegment = () => {
      if (!activeSegmentDetails) return;
      const currentIndex = currentSegments.findIndex(s => s.id === activeSegmentDetails.id);
      const prevIndex = (currentIndex - 1 + currentSegments.length) % currentSegments.length;
      handleSegmentClick(currentSegments[prevIndex].id);
  };

  const handleNextSegment = () => {
      if (!activeSegmentDetails) return;
      const currentIndex = currentSegments.findIndex(s => s.id === activeSegmentDetails.id);
      const nextIndex = (currentIndex + 1) % currentSegments.length;
      handleSegmentClick(currentSegments[nextIndex].id);
  };

  const setArteryProp = (id, prop, val) => {
      actions.setGlobalArteryStates(prev => ({
          ...prev, [leg]: { ...prev[leg], [id]: { ...(prev[leg][id] || {}), [prop]: val } }
      }));
  };

  const globalData = arteryStates.GLOBAL || {};
  const hasGlobalVarices = !!globalData.varices;

  const setGlobalProp = (prop, val) => {
      actions.setGlobalArteryStates(prev => ({
          ...prev, [leg]: { ...prev[leg], GLOBAL: { ...(prev[leg].GLOBAL || {}), [prop]: val } }
      }));
  };

  const activeSegmentState = activeSegmentDetails ? (arteryStates[activeSegmentDetails.id] || {}) : {};
  const activeInterventions = activeSegmentState.interventions || [];

  const dynamicFindings = [];
  if (activeSegmentState.color && activeSegmentState.color !== 'unmapped') dynamicFindings.push(TOOLS_MAP[activeSegmentState.color]);
  
  const getArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);
  getArray(activeSegmentState.pared).forEach(p => dynamicFindings.push(TOOLS_MAP[p]));
  getArray(activeSegmentState.focal).forEach(f => dynamicFindings.push(TOOLS_MAP[f]));
  activeInterventions.forEach(inv => dynamicFindings.push(TOOLS_MAP[inv]));

  const taValue = activeSegmentState.at ? parseInt(activeSegmentState.at, 10) : null;
  const psvValue = activeSegmentState.psv ? parseFloat(activeSegmentState.psv) : null;
  const edvValue = activeSegmentState.edv ? parseFloat(activeSegmentState.edv) : null;
  const diamValue = activeSegmentState.diameter ? parseFloat(activeSegmentState.diameter) : null;
  const lengthValue = activeSegmentState.length ? parseFloat(activeSegmentState.length) : null;
  const heightValue = activeSegmentState.height ? parseFloat(activeSegmentState.height) : null;
  const refluxValue = activeSegmentState.reflux ? parseInt(activeSegmentState.reflux, 10) : null;

  return (
    <aside className="w-[300px] flex flex-col shadow-lg z-20 shrink-0 h-full" style={{ backgroundColor: THEME.bgSidebar, borderLeft: isLeftHanded ? 'none' : `1px solid ${THEME.border}`, borderRight: isLeftHanded ? `1px solid ${THEME.border}` : 'none' }}>
      
      {/* NUEVO ENCABEZADO UNIFICADO */}
      <div className="h-14 px-4 shrink-0 flex items-center justify-center border-b relative" style={{ borderColor: THEME.border, backgroundColor: THEME.bgSidebar }}>
         <Activity className="w-4 h-4 text-cyan-500 mr-2" />
         <span className="text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: THEME.textMain }}>Reporte Clínico</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-6">
         
         {/* PANEL GLOBAL */}
         {hasGlobalVarices && (
            <div className="flex flex-col gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="w-[calc(100%+40px)] -mx-5 py-2 border-y flex items-center justify-center shadow-sm" style={{ backgroundColor: hexToRgba(THEME.cyan, 0.1), borderColor: THEME.cyan }}>
                   <span className="text-[10px] uppercase tracking-[0.25em] font-black text-cyan-400">Hallazgos Globales</span>
                </div>
                <div className="w-full flex flex-col gap-2 p-4 rounded-xl border border-cyan-500/30 shadow-lg relative overflow-hidden" style={{ backgroundColor: THEME.bgApp }}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <div className="flex items-center justify-between mb-1 pl-2">
                        <span className="text-[10px] uppercase tracking-widest font-black text-cyan-400 flex items-center gap-1.5">
                            <IconVarices className="w-4 h-4" /> Colaterales / Várices
                        </span>
                        <button onClick={() => setGlobalProp('varices', false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                            <X className="w-4 h-4 text-white/50" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 pl-2 mt-1">
                        <label className="text-[8px] uppercase tracking-widest" style={{ color: THEME.textMuted }}>Localización Anatómica</label>
                        <div className="relative">
                            <select 
                                value={globalData.varices_loc || ''} 
                                onChange={e => setGlobalProp('varices_loc', e.target.value)} 
                                className="w-full rounded-lg px-3 py-2.5 text-[11px] outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner appearance-none cursor-pointer font-bold" 
                                style={{ backgroundColor: THEME.bgSurface, border: `1px solid ${THEME.border}`, color: globalData.varices_loc ? THEME.textMain : THEME.textMuted }} 
                            >
                                <option value="" disabled>Selecciona una región...</option>
                                <optgroup label="Cara Medial">
                                    <option value="Cara medial, tercio proximal">Tercio proximal</option>
                                    <option value="Cara medial, tercio medio">Tercio medio</option>
                                    <option value="Cara medial, tercio distal">Tercio distal</option>
                                </optgroup>
                                <optgroup label="Cara Anterior">
                                    <option value="Cara anterior, tercio proximal">Tercio proximal</option>
                                    <option value="Cara anterior, tercio medio">Tercio medio</option>
                                    <option value="Cara anterior, tercio distal">Tercio distal</option>
                                </optgroup>
                                <optgroup label="Cara Posterior">
                                    <option value="Cara posterior, tercio proximal">Tercio proximal</option>
                                    <option value="Cara posterior, tercio medio">Tercio medio</option>
                                    <option value="Cara posterior, tercio distal">Tercio distal</option>
                                </optgroup>
                                <optgroup label="Cara Lateral">
                                    <option value="Cara lateral, tercio proximal">Tercio proximal</option>
                                    <option value="Cara lateral, tercio medio">Tercio medio</option>
                                    <option value="Cara lateral, tercio distal">Tercio distal</option>
                                </optgroup>
                                <optgroup label="Otros">
                                    <option value="Fosa poplítea">Fosa poplítea</option>
                                    <option value="Tobillo / Pie">Tobillo / Pie</option>
                                </optgroup>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: THEME.textMuted }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 pl-2 mt-2">
                        <label className="text-[8px] uppercase tracking-widest" style={{ color: THEME.textMuted }}>Técnica o Tratamiento</label>
                        <div className="relative">
                            <select 
                                value={globalData.varices_tech || ''} 
                                onChange={e => setGlobalProp('varices_tech', e.target.value)} 
                                className="w-full rounded-lg px-3 py-2.5 text-[11px] outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner appearance-none cursor-pointer font-bold" 
                                style={{ backgroundColor: THEME.bgSurface, border: `1px solid ${THEME.border}`, color: globalData.varices_tech ? THEME.textMain : THEME.textMuted }} 
                            >
                                <option value="" disabled>Selecciona técnica...</option>
                                <optgroup label="Escleroterapia">
                                    <option value="Escleroterapia líquida">Escleroterapia líquida</option>
                                    <option value="Escleroterapia con espuma (Foam)">Escleroterapia con espuma (Foam)</option>
                                    <option value="Escleroterapia ecoguiada">Escleroterapia ecoguiada</option>
                                </optgroup>
                                <optgroup label="Ablación / Quirúrgico">
                                    <option value="Microflebectomía">Microflebectomía</option>
                                    <option value="Láser transdérmico (Nd:YAG)">Láser transdérmico (Nd:YAG)</option>
                                </optgroup>
                                <optgroup label="Otros">
                                    <option value="Tratamiento conservador">Tratamiento conservador</option>
                                    <option value="Pendiente de definir">Pendiente de definir</option>
                                </optgroup>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: THEME.textMuted }} />
                        </div>
                    </div>
                </div>
            </div>
         )}

         {activeSegmentDetails ? (
            <div className="flex flex-col gap-4">
               
               <button 
                  onClick={generateAIReport} 
                  disabled={isGeneratingReport}
                  className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-[12px] font-bold transition-all active:scale-95 shadow-sm" 
                  style={{ 
                      backgroundColor: isGeneratingReport ? THEME.bgSurface : hexToRgba(THEME.cyan, 0.15), 
                      color: isGeneratingReport ? THEME.textMuted : THEME.cyan, 
                      border: `1px solid ${isGeneratingReport ? THEME.border : hexToRgba(THEME.cyan, 0.4)}`,
                      cursor: isGeneratingReport ? 'not-allowed' : 'pointer'
                  }}
               >
                  {isGeneratingReport ? (
                      <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" style={{ borderColor: THEME.textMuted, borderTopColor: 'transparent' }} />
                  ) : (
                      <Sparkles className="w-4 h-4" />
                  )}
                  {isGeneratingReport ? 'Redactando Informe...' : 'Generar Informe Clínico ✨'}
               </button>

               <div className="flex flex-col gap-3">
                   <div className="p-4 rounded-xl border shadow-inner flex flex-col items-center min-h-[72px]" style={{ backgroundColor: THEME.bgApp, borderColor: THEME.border }}>
                      <span className="text-[10px] uppercase tracking-widest font-bold block mb-1 text-center" style={{ color: THEME.textMuted }}>Vaso Seleccionado</span>
                      
                      <div className="flex items-center justify-between w-full mt-1 mb-1">
                          <button onClick={handlePrevSegment} className="p-1.5 rounded-lg transition-all hover:bg-white/10 active:scale-90" style={{ color: THEME.textMuted }}>
                              <ChevronLeft size={18} strokeWidth={2.5} />
                          </button>
                          
                          <span className="text-[15px] font-bold text-center leading-tight flex-1 px-1" style={{ color: THEME.textMain }}>
                              {activeSegmentDetails.name}
                          </span>
                          
                          <button onClick={handleNextSegment} className="p-1.5 rounded-lg transition-all hover:bg-white/10 active:scale-90" style={{ color: THEME.textMuted }}>
                              <ChevronRight size={18} strokeWidth={2.5} />
                          </button>
                      </div>

                      <div className="w-full flex flex-col gap-1 mt-2 pt-3 border-t" style={{ borderColor: THEME.border }}>
                          {dynamicFindings.length === 0 && !diamValue && !lengthValue && !heightValue && !refluxValue && !taValue && !psvValue ? (
                              <span className="text-[10px] text-center italic block py-1" style={{ color: THEME.textMuted }}>Sin datos registrados.</span>
                          ) : (
                              <>
                                  {dynamicFindings.map((tool, idx) => {
                                      const ToolIcon = tool?.icon;
                                      if(!ToolIcon) return null;
                                      return (
                                          <div key={`find-${idx}`} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                              <ToolIcon className="w-4 h-4 shrink-0" style={{ color: tool.hex || THEME.cyan }} />
                                              <span className="text-[11px] font-bold tracking-wide" style={{ color: THEME.textMain }}>{tool.name}</span>
                                          </div>
                                      );
                                  })}

                                  {psvValue !== null && !isNaN(psvValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <Activity className="w-4 h-4 shrink-0" style={{ color: THEME.textMuted }} />
                                          <span className="text-[11px] font-bold tracking-wide flex-1" style={{ color: THEME.textMain }}>PSV</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{psvValue} cm/s</span>
                                      </div>
                                  )}
                                  {edvValue !== null && !isNaN(edvValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <Activity className="w-4 h-4 shrink-0" style={{ color: THEME.textMuted }} />
                                          <span className="text-[11px] font-bold tracking-wide flex-1" style={{ color: THEME.textMain }}>EDV</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{edvValue} cm/s</span>
                                      </div>
                                  )}
                                  {taValue !== null && !isNaN(taValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <Activity className="w-4 h-4 shrink-0" style={{ color: THEME.textMuted }} />
                                          <span className="text-[11px] font-bold tracking-wide flex-1" style={{ color: THEME.textMain }}>TA</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{taValue} ms</span>
                                      </div>
                                  )}
                                  {diamValue !== null && !isNaN(diamValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <span className="text-[11px] font-bold tracking-wide flex-1 pl-6" style={{ color: THEME.textMain }}>Diámetro</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{diamValue} {activeSystem === 'VENOSO' ? 'mm' : 'cm'}</span>
                                      </div>
                                  )}
                                  {lengthValue !== null && !isNaN(lengthValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <span className="text-[11px] font-bold tracking-wide flex-1 pl-6" style={{ color: THEME.textMain }}>Longitud</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{lengthValue} cm</span>
                                      </div>
                                  )}
                                  {heightValue !== null && !isNaN(heightValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          <span className="text-[11px] font-bold tracking-wide flex-1 pl-6" style={{ color: THEME.textMain }}>Altura</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{heightValue} cm</span>
                                      </div>
                                  )}
                                  {refluxValue !== null && !isNaN(refluxValue) && (
                                      <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
                                          {refluxValue > 500 ? (
                                              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                                          ) : (
                                              <Activity className="w-4 h-4 shrink-0 text-green-500" />
                                          )}
                                          <span className="text-[11px] font-bold tracking-wide flex-1" style={{ color: THEME.textMain }}>Reflujo</span>
                                          <span className="text-[11px] font-mono font-black" style={{ color: THEME.textMain }}>{refluxValue} ms</span>
                                      </div>
                                  )}
                              </>
                          )}
                      </div>
                   </div>
               </div>
               
               <div className="flex flex-col pt-1">
                  <div className="flex flex-col gap-3">
                      {activeSystem === 'ARTERIAL' ? (
                          <>
                              {cartography === 'CAROTIDA' && (
                                  <div className="grid grid-cols-2 gap-3 w-full">
                                     <div className="flex flex-col gap-1.5 w-full">
                                         <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>PSV (cm/s)</label>
                                         <SmartInput type="number" inputMode="decimal" value={activeSegmentState.psv} onChange={val=>setArteryProp(activeSegmentDetails.id, 'psv', val)} placeholder="Pico" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                     </div>
                                     <div className="flex flex-col gap-1.5 w-full">
                                         <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>EDV (cm/s)</label>
                                         <SmartInput type="number" inputMode="decimal" value={activeSegmentState.edv} onChange={val=>setArteryProp(activeSegmentDetails.id, 'edv', val)} placeholder="Final" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                     </div>
                                  </div>
                              )}
                              <div className="grid grid-cols-2 gap-3 w-full">
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>TA (ms)</label>
                                     <SmartInput type="number" inputMode="decimal" value={activeSegmentState.at} onChange={val=>setArteryProp(activeSegmentDetails.id, 'at', val)} placeholder="Ej. 100" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Ratio (Vr)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.ratio} onChange={val=>setArteryProp(activeSegmentDetails.id, 'ratio', val)} placeholder="Ej. 2.5" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Diám (cm)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.diameter} onChange={val=>setArteryProp(activeSegmentDetails.id, 'diameter', val)} placeholder="Ej. 0.6" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Long (cm)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.length} onChange={val=>setArteryProp(activeSegmentDetails.id, 'length', val)} placeholder="Ej. 3.0" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                              </div>
                          </>
                      ) : (
                          // SISTEMA VENOSO
                          activeSegmentDetails.isPerforator ? (
                              // PERFORANTE (Particular)
                              <div className="grid grid-cols-2 gap-3 w-full">
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Diám. Fascial (mm)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.diameter} onChange={val=>setArteryProp(activeSegmentDetails.id, 'diameter', val)} placeholder="> 3.5 mm" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Altura (cm)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.height} onChange={val=>setArteryProp(activeSegmentDetails.id, 'height', val)} placeholder="De planta" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full col-span-2">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Tiempo de Reflujo (ms)</label>
                                     <SmartInput type="number" inputMode="decimal" step="10" value={activeSegmentState.reflux} onChange={val=>setArteryProp(activeSegmentDetails.id, 'reflux', val)} placeholder="> 500 ms" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                              </div>
                          ) : (
                              // EJE VENOSO TRONCULAR
                              <div className="grid grid-cols-2 gap-3 w-full">
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Diámetro (mm)</label>
                                     <SmartInput type="number" inputMode="decimal" step="0.1" value={activeSegmentState.diameter} onChange={val=>setArteryProp(activeSegmentDetails.id, 'diameter', val)} placeholder="Ej. 6.5" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                                 <div className="flex flex-col gap-1.5 w-full">
                                     <label className="text-[10px] uppercase tracking-widest text-center" style={{ color: THEME.textMuted }}>Reflujo (ms)</label>
                                     <SmartInput type="number" inputMode="decimal" step="10" value={activeSegmentState.reflux} onChange={val=>setArteryProp(activeSegmentDetails.id, 'reflux', val)} placeholder="> 500 ms" className="w-full rounded-xl py-3 text-center text-lg font-mono font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-inner" style={{ backgroundColor: THEME.bgApp, border: `1px solid ${THEME.border}`, color: THEME.textMain }} />
                                 </div>
                              </div>
                          )
                      )}
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex flex-col h-full items-center justify-center text-center opacity-40 pb-10">
                <MousePointerClick className="w-12 h-12 mb-4" />
                <span className="text-sm uppercase font-bold mb-2 tracking-wider">Modo Táctil</span>
                <span className="text-[11px] px-2 leading-relaxed">Toca un nodo circular en el mapa para registrar su estado o ingresar datos.</span>
            </div>
         )}
      </div>
      <div className="shrink-0 p-4 border-t flex flex-col gap-3" style={{ borderColor: THEME.border, backgroundColor: THEME.bgSidebar }}>
         <button onClick={() => { 
            actions.setGlobalArteryStates({'DERECHA':{}, 'IZQUIERDA':{}}); 
            try { localStorage.removeItem('doppler_draft_state'); } catch(e) {}
            actions.setActiveElement({ type: 'segment', id: cartography === 'PIERNA' ? 'femoral_comun' : 'sfj' }); 
         }} className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-[11px] font-bold transition-all active:scale-95 shadow-sm hover:bg-red-500/10" style={{ backgroundColor: THEME.bgApp, color: THEME.textMuted, border: `1px solid ${THEME.border}` }}>
            <Eraser className="w-3.5 h-3.5" /> Resetear Estudio
         </button>
      </div>
    </aside>
  );
};