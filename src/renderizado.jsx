import React, { useState } from 'react';
import { Activity, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Settings2, X, Plus, CornerUpLeft, MousePointerClick } from 'lucide-react';
import { THEME, hexToRgba, TOOLS_MAP, DEFAULT_TOOL_GRIDS } from './constants';
// ============================================================================
// COMPONENTES DE INTERFAZ Y RENDERIZADO
// ============================================================================

export const SidebarLeft = ({ state, actions }) => {
  const { activeSystem, cartography, isLeftHanded, thumbOffset, activeElement, arteryStates, activeColor, activePared, activeFocal, activeInterventions, toolPage, customGrids, isEditingGrid, toolToSwap } = state;
  const { setIsLeftHanded, setThumbOffset, handleToolClick, setToolPage, setIsEditingGrid, handleToolSwap } = actions;
  
  const [pressedTool, setPressedTool] = useState(null);
  const [showSettings, setShowSettings] = useState(false); 

  const activeToolInfo = pressedTool && pressedTool !== 'NEXT_PAGE' && pressedTool !== 'PREV_PAGE' ? TOOLS_MAP[pressedTool] : null;

  const currentSystemKey = activeSystem === 'VENOSO' ? 'VENOSO' : cartography;
  const activeSystemTools = customGrids[currentSystemKey] || DEFAULT_TOOL_GRIDS[currentSystemKey];
  
  const PAGE_SIZE = 11;
  const totalPages = Math.ceil(activeSystemTools.length / PAGE_SIZE);
  const startIdx = toolPage * PAGE_SIZE;
  const currentTools = activeSystemTools.slice(startIdx, startIdx + PAGE_SIZE);
  
  const gridSlots = Array(12).fill(null);
  for (let i = 0; i < 11; i++) {
      gridSlots[i] = currentTools[i] || null;
  }
  
  if (totalPages > 1) {
      gridSlots[11] = toolPage === 0 ? 'NEXT_PAGE' : 'PREV_PAGE';
  } else {
      gridSlots[11] = activeSystemTools[11] || null; 
  }

  const displaySlots = [];
  for (let row = 0; row < 4; row++) {
      const rData = [gridSlots[row*3], gridSlots[row*3+1], gridSlots[row*3+2]];
      if (isLeftHanded) rData.reverse();
      displaySlots.push(...rData);
  }

  return (
    <aside className="w-[210px] flex flex-col shadow-2xl z-30 shrink-0 h-full relative" style={{ backgroundColor: THEME.bgSidebar, borderRight: isLeftHanded ? 'none' : `1px solid ${THEME.border}`, borderLeft: isLeftHanded ? `1px solid ${THEME.border}` : 'none' }}>
      
      <div className="h-14 px-4 shrink-0 flex items-center justify-between border-b relative" style={{ borderColor: THEME.border, backgroundColor: THEME.bgSidebar }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-500" />
          <div className="flex flex-col">
            <h1 className="text-[14px] font-bold leading-none tracking-tight">DopplerMap <span className="font-light" style={{ color: THEME.textMuted }}>Pro</span></h1>
            <span className="text-[7px] uppercase tracking-[0.2em] font-bold text-cyan-500 text-right mt-0.5">Suite</span>
          </div>
        </div>
        
        <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-md transition-colors" style={{ backgroundColor: showSettings ? THEME.bgHover : 'transparent' }}>
            <Settings2 size={18} className={showSettings ? 'text-cyan-400' : 'text-gray-400'} />
        </button>

        {showSettings && (
            <div className="absolute top-14 right-2 w-48 rounded-xl shadow-2xl border p-3 flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95" style={{ backgroundColor: THEME.bgSurface, borderColor: THEME.border }}>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 border-b border-white/10 pb-1">Ergonomía</span>
                
                <button onClick={() => {setIsLeftHanded(!isLeftHanded); setShowSettings(false);}} className="text-[11px] font-bold text-left hover:text-cyan-400 transition-colors flex items-center justify-between">
                    <span>{isLeftHanded ? 'Modo Zurdo' : 'Modo Diestro'}</span>
                    <span className="text-[16px]">{isLeftHanded ? '🖐️' : '🤚'}</span>
                </button>
                
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-left text-gray-300">Altura Pulgar</span>
                    <div className="flex gap-1">
                        <button onClick={() => setThumbOffset(p => Math.min(p + 30, 300))} className="p-1 rounded-md border bg-black/20 hover:bg-black/40 transition-all active:scale-95" style={{ borderColor: THEME.border }}><ChevronUp size={14} strokeWidth={3} /></button>
                        <button onClick={() => setThumbOffset(p => Math.max(p - 30, 0))} className="p-1 rounded-md border bg-black/20 hover:bg-black/40 transition-all active:scale-95" style={{ borderColor: THEME.border }}><ChevronDown size={14} strokeWidth={3} /></button>
                    </div>
                </div>

                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 border-b border-white/10 pb-1 mt-2">Botonera</span>
                
                <button onClick={() => {setIsEditingGrid(!isEditingGrid); handleToolSwap(null); setShowSettings(false);}} className={`text-[11px] font-bold text-left transition-colors flex items-center justify-between ${isEditingGrid ? 'text-yellow-500' : 'text-gray-300 hover:text-white'}`}>
                    <span>{isEditingGrid ? 'Terminar Edición' : 'Editar Botones'}</span>
                    {isEditingGrid ? <X size={14} /> : <Settings2 size={14} />}
                </button>
            </div>
        )}
      </div>

      <div className="shrink-0 p-4 border-b flex flex-col items-center justify-center w-full min-h-[140px] transition-all flex-1" style={{ borderColor: THEME.border, backgroundColor: THEME.bgSidebar }}>
          {isEditingGrid ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-150">
                  <Settings2 className="w-10 h-10 mb-3 text-yellow-500 animate-spin-slow" />
                  <span className="text-[14px] font-bold text-center leading-tight text-yellow-500">Modo Edición</span>
                  <span className="text-[9px] uppercase tracking-widest mt-1.5 text-yellow-500/70 text-center">
                      {toolToSwap ? 'Toca otro botón para intercambiar' : 'Toca un botón para moverlo'}
                  </span>
              </div>
          ) : activeToolInfo ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-150">
                  <activeToolInfo.icon className="w-12 h-12 mb-3" style={{ color: activeToolInfo.hex || THEME.cyan }} />
                  <span className="text-[14px] font-bold text-center leading-tight" style={{ color: THEME.textMain }}>{activeToolInfo.name}</span>
                  <span className="text-[9px] uppercase tracking-widest mt-1.5 font-bold" style={{ color: THEME.textMuted }}>
                      {activeToolInfo.category === 'color' ? 'ESTADO / FLUJO' : activeToolInfo.category === 'trayecto' ? 'PARED / TRAYECTO' : activeToolInfo.category === 'global' ? 'HALLAZGO GLOBAL' : activeToolInfo.category === 'focal' ? 'LESIÓN FOCAL' : 'INTERVENCIÓN QX'}
                  </span>
              </div>
          ) : (
              <div className="flex flex-col items-center opacity-30">
                  <MousePointerClick className="w-8 h-8 mb-2" />
                  <span className="text-[11px] uppercase tracking-widest font-bold text-center" style={{ color: THEME.textMain }}>Modo Táctil</span>
              </div>
          )}
      </div>

      <div className="relative shrink-0 w-full" style={{ height: `${320 + thumbOffset}px` }}>
        <div className="absolute w-full px-3 transition-all duration-300 ease-out" style={{ bottom: `${20 + thumbOffset}px` }}>
          <div className="flex justify-between items-center mb-2 px-2 opacity-50">
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: THEME.textMain }}>Herramientas</span>
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: THEME.textMuted }}>Pág. {toolPage + 1}/{totalPages}</span>
          </div>

          <div className={`flex flex-col gap-2 p-2 rounded-xl shadow-lg border transition-all ${isEditingGrid ? 'ring-2 ring-yellow-500/50 border-yellow-500/30 bg-[#2a2510]' : ''}`} style={{ backgroundColor: isEditingGrid ? undefined : THEME.bgApp, borderColor: isEditingGrid ? undefined : THEME.border }}>
              <div className="grid grid-cols-3 gap-1.5 items-start">
                  {displaySlots.map((toolId, index) => {
                      if (!toolId) return <div key={`empty-${index}`} className="aspect-square rounded-xl border border-dashed border-white/10" />;
                      
                      if (toolId === 'NEXT_PAGE' || toolId === 'PREV_PAGE') {
                          return (
                              <button 
                                key={toolId} 
                                onClick={() => setToolPage(toolId === 'NEXT_PAGE' ? toolPage + 1 : toolPage - 1)} 
                                className="flex flex-col items-center justify-center aspect-square rounded-xl border transition-all active:scale-95 shadow-inner hover:bg-white/5" 
                                style={{ backgroundColor: THEME.bgSurface, borderColor: toolId === 'NEXT_PAGE' ? THEME.cyan : THEME.border }}
                              >
                                  {toolId === 'NEXT_PAGE' 
                                    ? <><Plus className="w-7 h-7 mb-0.5" style={{color: THEME.cyan}}/><span className="text-[8px] uppercase tracking-widest font-bold" style={{color: THEME.cyan}}>Más</span></>
                                    : <><CornerUpLeft className="w-6 h-6 mb-0.5" style={{color: THEME.textMain}}/><span className="text-[8px] uppercase tracking-widest font-bold" style={{color: THEME.textMuted}}>Volver</span></>
                                  }
                              </button>
                          );
                      }

                      const tool = TOOLS_MAP[toolId];
                      if(!tool) return null;

                      let isActive = false;
                      const isBeingSwapped = isEditingGrid && toolToSwap === toolId;
                      
                      if (!isEditingGrid) {
                          if (tool.category === 'global') {
                              isActive = !!(arteryStates.GLOBAL && arteryStates.GLOBAL[toolId]);
                          } else if (activeElement) {
                              const sState = arteryStates[activeElement.id] || {};
                              if (tool.category === 'color') isActive = sState.color === toolId;
                              else if (tool.category === 'focal') isActive = (sState.focal || []).includes(toolId);
                              else if (tool.category === 'trayecto') isActive = (sState.pared || []).includes(toolId);
                              else if (tool.category === 'intervention') isActive = (sState.interventions || []).includes(toolId);
                          } else {
                              if (tool.category === 'color') isActive = activeColor === toolId;
                              else if (tool.category === 'focal') isActive = activeFocal.includes(toolId);
                              else if (tool.category === 'trayecto') isActive = activePared.includes(toolId);
                              else if (tool.category === 'intervention') isActive = activeInterventions.includes(toolId);
                          }
                      }

                      const colorRender = tool.hex || (tool.category === 'intervention' ? THEME.cyan : THEME.textMain);
                      const isFlow = tool.category === 'color';

                      let btnStyle = { backgroundColor: isActive ? THEME.bgHover : THEME.bgSurface, borderColor: isActive ? colorRender : THEME.border };
                      if (isEditingGrid) {
                          btnStyle = { 
                              backgroundColor: isBeingSwapped ? hexToRgba(THEME.yellow, 0.2) : THEME.bgSurface, 
                              borderColor: isBeingSwapped ? THEME.yellow : THEME.border,
                              borderStyle: 'dashed'
                          };
                      }

                      return (
                          <button 
                              key={toolId} 
                              onClick={() => isEditingGrid ? handleToolSwap(toolId) : handleToolClick(toolId)} 
                              onPointerDown={() => !isEditingGrid && setPressedTool(toolId)}
                              onPointerUp={() => !isEditingGrid && setPressedTool(null)}
                              onPointerLeave={() => !isEditingGrid && setPressedTool(null)}
                              onContextMenu={(e) => e.preventDefault()}
                              className={`flex items-center justify-center aspect-square rounded-xl border transition-all active:scale-95 touch-none ${isBeingSwapped ? 'animate-pulse' : ''}`} 
                              style={btnStyle}
                          >
                              <tool.icon 
                                  className="w-7 h-7 pointer-events-none transition-opacity" 
                                  style={{ 
                                      color: isEditingGrid ? THEME.textMain : (isFlow ? tool.hex : (isActive ? colorRender : THEME.textMuted)),
                                      opacity: (!isEditingGrid && isFlow && !isActive) ? 0.5 : 1
                                  }} 
                              />
                          </button>
                      );
                  })}
              </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ============================================================================
// FUNCIONES DE SOPORTE DE RENDERIZADO (AISLADAS PARA PERFORMANCE)
// ============================================================================
export const calculateSegmentStyle = (segment, sState) => {
    const safeState = sState || {};
    const width = segment.type === 'macro' ? 12 : (segment.type === 'branch' ? 10 : 8);
    const defaultColor = segment.altBase ? THEME.unmappedAlt : THEME.unmapped;

    const focalArray = Array.isArray(safeState.focal) ? safeState.focal : (safeState.focal ? [safeState.focal] : []);
    let hasManualColor = !!(safeState.color && safeState.color !== 'unmapped');
    let colorHex = hasManualColor ? TOOLS_MAP[safeState.color]?.hex : defaultColor;
    
    if (focalArray.includes('perf_incompetent') && segment.isPerforator) {
        colorHex = THEME.red;
        hasManualColor = true;
    }
    
    const pared = Array.isArray(safeState.pared) ? safeState.pared : (safeState.pared ? [safeState.pared] : []);
    const interventions = safeState.interventions || [];

    const isMapped = hasManualColor || pared.length > 0 || focalArray.length > 0 || interventions.length > 0 || 
                     (safeState.at && !isNaN(safeState.at)) || (safeState.ratio && !isNaN(safeState.ratio)) || 
                     (safeState.length && !isNaN(safeState.length)) || (safeState.height && !isNaN(safeState.height)) || 
                     (safeState.reflux && !isNaN(safeState.reflux)) || (safeState.diameter && !isNaN(safeState.diameter)) || 
                     (safeState.psv && !isNaN(safeState.psv));

    return { isMapped, colorHex, width, pared, focal: focalArray, interventions, hasColor: hasManualColor, sStateColor: safeState.color };
};