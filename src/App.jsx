import React, { useState, useEffect, useRef } from 'react';
import { Activity, Eraser, MousePointerClick, AlertTriangle, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Droplet, Zap, Sparkles, Copy, X, Plus, CornerUpLeft, Settings2, Save } from 'lucide-react';

import { THEME, hexToRgba, TOOLS_MAP, DEFAULT_TOOL_GRIDS, SmartInput, IconVarices, ARTERIAL_SEGMENTS, CAROTID_SEGMENTS, VSM_SEGMENTS, VSP_SEGMENTS, SVP_SEGMENTS, parsePathData, getPointsAlongParsedPath, generateToolPath, generateXPath, generateStitchesPath, generateCrossesPath } from './constants.jsx';

import { SidebarLeft, calculateSegmentStyle } from './renderizado';

import { SegmentLayer, MapCanvas, SidebarRight } from './memoizacion.jsx'



// ============================================================================
// MODAL DE REPORTE GEMINI LLM CON EXPORTACIÓN A ERPNEXT
// ============================================================================
const AIReportModal = ({ isOpen, onClose, reportContent, setReportContent, onExport, isExporting }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = reportContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert("¡Informe copiado al portapapeles!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl border" style={{ backgroundColor: THEME.bgSidebar, borderColor: THEME.border }}>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: THEME.border }}>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <h2 className="font-bold text-lg" style={{ color: THEME.textMain }}>Informe Médico Generado (IA)</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" style={{ color: THEME.textMuted }} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden p-4">
                    <textarea 
                        className="w-full h-full p-4 rounded-lg outline-none font-mono text-sm leading-relaxed custom-scrollbar resize-none border"
                        style={{ backgroundColor: THEME.bgApp, color: THEME.textMain, borderColor: THEME.border }}
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                    />
                </div>
                
                <div className="p-4 border-t flex justify-between gap-3 bg-black/20" style={{ borderColor: THEME.border }}>
                    <button onClick={handleCopy} className="px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 border hover:bg-white/5" style={{ backgroundColor: 'transparent', color: THEME.textMain, borderColor: THEME.border }}>
                        <Copy className="w-4 h-4" /> Copiar al Portapapeles
                    </button>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 border hover:bg-white/5" style={{ backgroundColor: THEME.bgApp, color: THEME.textMuted, borderColor: THEME.border }}>
                            Cancelar
                        </button>
                        <button 
                            onClick={onExport} 
                            disabled={isExporting}
                            className="px-4 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 text-white" 
                            style={{ backgroundColor: isExporting ? THEME.unmapped : THEME.green, opacity: isExporting ? 0.7 : 1 }}
                        >
                            {isExporting ? <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
                            {isExporting ? 'Guardando...' : 'Guardar en ERPNext'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// APP ROOT (Ensamblador de Estado y Layout)
// ============================================================================

export default function App() {
  const [activeSystem, setActiveSystem] = useState('ARTERIAL'); 
  const [cartography, setCartography] = useState('PIERNA'); 
  const [leg, setLeg] = useState('DERECHA'); 
  const [toolPage, setToolPage] = useState(0); 
  
  const [activeColor, setActiveColor] = useState(null);
  const [activePared, setActivePared] = useState([]); 
  const [activeFocal, setActiveFocal] = useState([]); 
  const [activeInterventions, setActiveInterventions] = useState([]); 

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // --- AUTOGUARDADO (Seguro de Vida) ---
  const [globalArteryStates, setGlobalArteryStates] = useState(() => {
    try {
        const draft = localStorage.getItem('doppler_draft_state');
        return draft ? JSON.parse(draft) : { 'DERECHA': {}, 'IZQUIERDA': {} };
    } catch(e) { 
        return { 'DERECHA': {}, 'IZQUIERDA': {} }; 
    }
  });

  useEffect(() => { 
    try { 
        localStorage.setItem('doppler_draft_state', JSON.stringify(globalArteryStates)); 
    } catch(e) {} 
  }, [globalArteryStates]);

  // ESTADO: Custom Grid Data
  const [customGrids, setCustomGrids] = useState(() => {
    try {
      const saved = localStorage.getItem('customToolGrids');
      if (saved) {
         const parsed = JSON.parse(saved);
         if (parsed.VENOSO && parsed.VENOSO.length < DEFAULT_TOOL_GRIDS.VENOSO.length) return DEFAULT_TOOL_GRIDS;
         return parsed;
      }
      return DEFAULT_TOOL_GRIDS;
    } catch(e) { return DEFAULT_TOOL_GRIDS; }
  });
  
  const [isEditingGrid, setIsEditingGrid] = useState(false);
  const [toolToSwap, setToolToSwap] = useState(null);

  const [isLeftHanded, setIsLeftHanded] = useState(() => {
    try { return localStorage.getItem('isLeftHanded') === 'true'; } catch(e) { return false; }
  });
  
  const [thumbOffset, setThumbOffset] = useState(() => {
    try { const val = localStorage.getItem('thumbOffset'); return val ? parseInt(val, 10) : 20; } catch(e) { return 20; }
  }); 

  useEffect(() => { try { localStorage.setItem('isLeftHanded', isLeftHanded); } catch(e) {} }, [isLeftHanded]);
  useEffect(() => { try { localStorage.setItem('thumbOffset', thumbOffset); } catch(e) {} }, [thumbOffset]);
  useEffect(() => { try { localStorage.setItem('customToolGrids', JSON.stringify(customGrids)); } catch(e) {} }, [customGrids]);
  
  const arteryStates = globalArteryStates[leg] || {};
  
  const currentSegments = cartography === 'PIERNA' ? ARTERIAL_SEGMENTS : cartography === 'CAROTIDA' ? CAROTID_SEGMENTS : cartography === 'VSP' ? VSP_SEGMENTS : cartography === 'SVP' ? SVP_SEGMENTS : VSM_SEGMENTS;
  
  const [activeElement, setActiveElement] = useState({ type: 'segment', id: 'femoral_comun' });
  const activeSegmentDetails = activeElement?.type === 'segment' ? currentSegments.find(a => a.id === activeElement.id) : null;
  
  const switchSystem = (sys) => {
      setActiveSystem(sys);
      setToolPage(0);
      setIsEditingGrid(false);
      setToolToSwap(null);
      if (sys === 'ARTERIAL') {
          setCartography('PIERNA');
          setActiveElement({ type: 'segment', id: 'femoral_comun' });
      } else {
          setCartography('VSM');
          setActiveElement({ type: 'segment', id: 'sfj' });
      }
      setActiveColor(null); setActivePared([]); setActiveFocal([]); setActiveInterventions([]);
  };

  const switchCartography = (view) => {
      setCartography(view);
      setToolPage(0);
      setIsEditingGrid(false);
      setToolToSwap(null);
      setActiveElement({ type: 'segment', id: view === 'PIERNA' ? 'femoral_comun' : view === 'CAROTIDA' ? 'cca_prox' : view === 'VSP' ? 'usp' : view === 'SVP' ? 'vfc' : 'sfj' });
      setActiveColor(null); setActivePared([]); setActiveFocal([]); setActiveInterventions([]);
  };

  const setLegAndReset = (newLeg) => {
      setLeg(newLeg);
      setActiveElement(null);
  };

  const handleToolSwap = (clickedToolId) => {
      if (clickedToolId === null) {
          setToolToSwap(null);
          return;
      }
      
      if (!toolToSwap) {
          setToolToSwap(clickedToolId);
      } else {
          setCustomGrids(prev => {
              const newGrids = { ...prev };
              const currentGridKey = activeSystem === 'VENOSO' ? 'VENOSO' : cartography;
              const gridArray = [...(newGrids[currentGridKey] || DEFAULT_TOOL_GRIDS[currentGridKey])];

              const idx1 = gridArray.indexOf(toolToSwap);
              const idx2 = gridArray.indexOf(clickedToolId);

              if (idx1 !== -1 && idx2 !== -1) {
                  [gridArray[idx1], gridArray[idx2]] = [gridArray[idx2], gridArray[idx1]];
                  newGrids[currentGridKey] = gridArray;
              }
              return newGrids;
          });
          setToolToSwap(null);
      }
  };

  const handleToolClick = (toolId) => {
    const tool = TOOLS_MAP[toolId];
    if (!tool) return;

    if (tool.category === 'global') {
        setGlobalArteryStates(prev => {
            const legState = prev[leg] || {};
            const globalData = legState.GLOBAL || {};
            const isActive = !!globalData[toolId];
            return {
                ...prev,
                [leg]: {
                    ...legState,
                    GLOBAL: {
                        ...globalData,
                        [toolId]: !isActive
                    }
                }
            };
        });
        return;
    }
    
    if (activeElement) {
        const sState = arteryStates[activeElement.id] || {};
        if (tool.category === 'color') {
            const isActive = sState.color === toolId;
            setGlobalArteryStates(prev => ({...prev, [leg]: { ...prev[leg], [activeElement.id]: { ...(prev[leg][activeElement.id] || {}), color: isActive ? 'unmapped' : toolId } }}));
        } else {
            const propName = tool.category === 'intervention' ? 'interventions' : (tool.category === 'trayecto' ? 'pared' : 'focal');
            const currentArr = Array.isArray(sState[propName]) ? sState[propName] : (sState[propName] ? [sState[propName]] : []);
            const newArr = currentArr.includes(toolId) ? currentArr.filter(i => i !== toolId) : [...currentArr, toolId];
            setGlobalArteryStates(prev => ({...prev, [leg]: { ...prev[leg], [activeElement.id]: { ...(prev[leg][activeElement.id] || {}), [propName]: newArr } }}));
        }
    } else {
        if (tool.category === 'color') setActiveColor(activeColor === toolId ? null : toolId);
        else if (tool.category === 'trayecto') setActivePared(prev => prev.includes(toolId) ? prev.filter(i => i !== toolId) : [...prev, toolId]);
        else if (tool.category === 'focal') setActiveFocal(prev => prev.includes(toolId) ? prev.filter(i => i !== toolId) : [...prev, toolId]);
        else if (tool.category === 'intervention') setActiveInterventions(prev => prev.includes(toolId) ? prev.filter(i => i !== toolId) : [...prev, toolId]);
    }
  };
  //
  const handleSegmentClick = (segmentId) => {
    if (activeColor || activePared.length > 0 || activeFocal.length > 0 || activeInterventions.length > 0) {
      setGlobalArteryStates(prev => {
        const existing = prev[leg][segmentId] || {};
        let newColor = activeColor !== null ? activeColor : existing.color;
        if (activeColor && activeColor === existing.color) newColor = 'unmapped';
        
        const mergeArrays = (existingData, activeData) => {
            let res = Array.isArray(existingData) ? [...existingData] : (existingData ? [existingData] : []);
            activeData.forEach(item => {
                if (res.includes(item)) res = res.filter(i => i !== item);
                else res.push(item);
            });
            return res;
        };

        return { 
            ...prev, [leg]: { 
                ...prev[leg], [segmentId]: { 
                    ...existing, 
                    color: newColor, 
                    pared: mergeArrays(existing.pared, activePared), 
                    focal: mergeArrays(existing.focal, activeFocal), 
                    interventions: mergeArrays(existing.interventions, activeInterventions) 
                } 
            } 
        };
      });
      setActiveColor(null); setActivePared([]); setActiveFocal([]); setActiveInterventions([]);
    }
    setActiveElement({ type: 'segment', id: segmentId });
  };
  //
  // --- INTEGRACIÓN: GUARDAR EN ERPNEXT ---
  //
  const exportToERPNext = async () => {
    const baseUrl = import.meta.env.VITE_FRAPPE_URL;
    const apiKey = import.meta.env.VITE_FRAPPE_API_KEY;
    const apiSecret = import.meta.env.VITE_FRAPPE_API_SECRET;
    console.log("exportToERPNext")
    if (!baseUrl || !apiKey || !apiSecret) {
        alert("❌ Error de configuración: faltan variables de entorno.");
        return;
    }

    const url = `${baseUrl}/api/method/dopplermap.api.guardar_doppler_frontend`;
    const payload = {
        encounter_id: window.current_encounter_id || "ID_NO_ENCONTRADO",
        sistema: activeSystem,
        reporte_ia: reportContent,
        matriz_datos: JSON.stringify(globalArteryStates)
    };
    const credentials = btoa(`${apiKey}:${apiSecret}`);

    setIsExporting(true);
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
            'Expect': ''   // ← CLAVE: elimina la cabecera Expect
        },
        body: JSON.stringify(payload),
        credentials: 'omit'
        });

        if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        if (data.exc) throw new Error(data.exc);

        alert("✅ Estudio guardado exitosamente");
        setIsReportModalOpen(false);
        localStorage.removeItem('doppler_draft_state');
    } catch (err) {
        console.error(err);
        alert(`❌ Error: ${err.message}`);
    } finally {
        setIsExporting(false);
    }
  };

  const generateAIReport = async () => {
      console.log("generateAIReport");
      setIsGeneratingReport(true);
      const contextData = { ESTUDIO: cartography, SISTEMA: activeSystem, DERECHA: {}, IZQUIERDA: {} };
      const getSegName = (id) => currentSegments.find(s => s.id === id)?.name || id;
      
      for (const currentLeg of ['DERECHA', 'IZQUIERDA']) {
          for (const [segId, data] of Object.entries(globalArteryStates[currentLeg])) {
              
              if (segId === 'GLOBAL') {
                  if (data.varices) {
                      contextData[currentLeg]['HALLAZGOS_COLATERALES'] = {
                          tipo: "Varices y/o Telangiectasias",
                          localizacion: data.varices_loc || "No especificada",
                          tratamiento: data.varices_tech || "No especificado"
                      };
                  }
                  continue;
              }

              if (Object.keys(data).length > 0) {
                  const cleanedData = { ...data };
                  if (cleanedData.color) cleanedData.color = TOOLS_MAP[cleanedData.color]?.name || cleanedData.color;
                  if (cleanedData.pared) cleanedData.pared = cleanedData.pared.map(p => TOOLS_MAP[p]?.name || p);
                  if (cleanedData.focal) cleanedData.focal = cleanedData.focal.map(f => TOOLS_MAP[f]?.name || f);
                  if (cleanedData.interventions) cleanedData.interventions = cleanedData.interventions.map(i => TOOLS_MAP[i]?.name || i);
                  
                  if (cleanedData.diameter) cleanedData.diametro = cleanedData.diameter + (activeSystem === 'VENOSO' ? ' mm' : ' cm');
                  if (cleanedData.reflux) cleanedData.tiempo_reflujo = cleanedData.reflux + ' ms';
                  if (cleanedData.height) cleanedData.altura = cleanedData.height + ' cm';
                  if (cleanedData.length) cleanedData.longitud = cleanedData.length + ' cm';
                  
                  delete cleanedData.diameter;
                  delete cleanedData.reflux;
                  delete cleanedData.height;
                  delete cleanedData.length;

                  contextData[currentLeg][getSegName(segId)] = cleanedData;
              }
          }
      }

      const prompt = `Eres un médico especialista en diagnóstico por imágenes y ecografía vascular. 
      Redacta el informe médico narrativo final de un Eco Doppler (${activeSystem === 'VENOSO' ? 'Venoso' : 'Arterial'}) usando exclusivamente los siguientes hallazgos registrados por el operador. 
      Estructura el informe formalmente con los apartados: "Hallazgos Ecográficos" y "Conclusión Diagnóstica".
      Si una extremidad no tiene datos, indica que no se exploró o está dentro de la normalidad anatómica.
      Los datos están en formato JSON. Usa un lenguaje formal, técnico y conciso. No agregues saludos.
      
      Datos Registrados:
      ${JSON.stringify(contextData)}`;

      const baseUrl = import.meta.env.VITE_FRAPPE_URL;
      const url = `${baseUrl}/api/method/dopplermap.api.generar_reporte_gemini`;

      const apiKey = import.meta.env.VITE_FRAPPE_API_KEY;
      const apiSecret = import.meta.env.VITE_FRAPPE_API_SECRET;

      //console.log("Url:", url);
      //console.log("API Key:", import.meta.env.VITE_FRAPPE_API_KEY);
      //console.log("API Secret:", import.meta.env.VITE_FRAPPE_API_SECRET);

       // Concatenar clave y secreto para la autenticación básica, según la documentación oficial[reference:3]
      const authString = `${apiKey}:${apiSecret}`;
      const encodedAuth = btoa(authString); // Codificar en base64

      const payload = { prompt_text: prompt };

      let delay = 1000;
      let finalContent = "Error al conectar con la Inteligencia Artificial.";
      
      for (let i = 0; i < 5; i++) {
          try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedAuth}`
                },
                body: JSON.stringify(payload),
                credentials: 'omit'   // ← Importante: evita enviar cookies de sesión
            });
              
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.exception || errorMessage;
                } catch (e) {
                    // Si no es JSON, leemos como texto
                    errorMessage = await response.text();
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            finalContent = data.message || "No se pudo generar el texto.";
            console.log(finalContent);
            break;
          } catch (error) {
                console.error("Intento fallido", i, error);
                if (i === 4) {
                    finalContent = "Hubo un error de conexión tras varios intentos. Revisa tu internet o la disponibilidad del servicio.";
                } else {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                }
          }
      }
      console.log('Paso por aqui');
      setReportContent(finalContent);
      setIsGeneratingReport(false);
      setIsReportModalOpen(true);
  };

  const layoutFlexDir = isLeftHanded ? 'flex-row-reverse' : 'flex-row';

  const state = { activeSystem, cartography, leg, activeColor, activePared, activeFocal, activeInterventions, isLeftHanded, thumbOffset, arteryStates, activeElement, currentSegments, activeSegmentDetails, toolPage, customGrids, isEditingGrid, toolToSwap };
  const actions = { switchSystem, setIsLeftHanded, setThumbOffset, handleToolClick, switchCartography, setLeg: setLegAndReset, setActiveElement, setGlobalArteryStates, handleSegmentClick, generateAIReport, isGeneratingReport, setToolPage, setIsEditingGrid, handleToolSwap };

  return (
    <div className={`flex h-[100dvh] w-full font-sans overflow-hidden selection:bg-cyan-500/30 touch-none overscroll-none ${layoutFlexDir}`} style={{ backgroundColor: THEME.bgApp, color: THEME.textMain }}>
      <SidebarLeft state={state} actions={actions} />
      <MapCanvas state={state} actions={actions} />
      <SidebarRight state={state} actions={actions} />
      
      <AIReportModal 
         isOpen={isReportModalOpen} 
         onClose={() => setIsReportModalOpen(false)} 
         reportContent={reportContent} 
         setReportContent={setReportContent}
         onExport={exportToERPNext}
         isExporting={isExporting}
      />
    </div>
  );
}

