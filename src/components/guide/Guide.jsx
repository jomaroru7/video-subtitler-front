import React, { useState } from 'react';

const Guide = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-80 p-4 bg-white shadow-lg rounded-xl lg:fixed lg:top-4 lg:left-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left font-semibold text-lg flex justify-between">
        Instrucciones
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          <p>1. Sube tu video. Cuando termine de procesar tendrás los subtítulos generados.</p>
          <p>
            2. Modifica los subtítulos a tu gusto. Para ello deberás pausar el video.
            <br/>
            Cada vez que modifiques una parte de los subtítulos, presiona el botón "Actualizar subtítulos"
          </p>
          <p>3. Al acabar de modificar, pulsa el botón "Generar video subtitulado".</p>
          <p>4. Al acabar, presiona el botón "Descargar video" para obtener tu video</p>
        </div>
      )}
    </div>
  );
};

export default Guide;
