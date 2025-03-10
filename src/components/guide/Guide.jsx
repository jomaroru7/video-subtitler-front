import React, { useState } from 'react';

const Guide = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-80 p-4 bg-white shadow-lg rounded-xl xl:absolute xl:top-4 xl:left-4 z-10 my-2.5 xl:my-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left font-semibold text-lg flex justify-between">
        Instrucciones
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          <p>1. Sube tu video.</p>
          <p>2. Espera que nuestra IA haga el trabajo. Aproximadamente, cada 1 min de vídeo tarda 30 segundos en todo el proceso.</p>
          <p>3. Modifica los subtítulos a tu gusto. Puedes cambiar los subtítulos en cada segmento del vídeo, presionando el botón "Actualizar subtítulos".</p>
          <p>4. Al acabar de modificar, pulsa el botón "Generar video subtitulado".</p>
          <p>5. Aparecerá un nuevo botón, "Descargar video", cuando el proceso termine.</p>
        </div>
      )}
    </div>
  );
};

export default Guide;
