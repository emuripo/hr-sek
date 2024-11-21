import { useState, useEffect } from 'react';

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFunction();
        console.log('Datos obtenidos:', result); // Depuración
        setData(result);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, isLoading, error }; // Devuelve datos, estado de carga y error
};
