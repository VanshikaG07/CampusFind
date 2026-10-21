import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as resourceService from '../services/resourceService';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getResources();
      setResources(data);
    } catch (err) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const addResource = async (resourceData) => {
    const newRes = await resourceService.createResource(resourceData);
    setResources((prev) => [newRes, ...prev]);
    return newRes;
  };

  const updateResource = async (id, updatedData) => {
    const updated = await resourceService.updateResource(id, updatedData);
    setResources((prev) =>
      prev.map((r) => (r.id === Number(id) ? updated : r))
    );
    return updated;
  };

  const removeResource = async (id) => {
    await resourceService.deleteResource(id);
    setResources((prev) => prev.filter((r) => r.id !== Number(id)));
    return true;
  };

  const getResource = useCallback(
    (id) => {
      return resources.find((r) => r.id === Number(id)) || null;
    },
    [resources]
  );

  return (
    <ResourceContext.Provider
      value={{
        resources,
        loading,
        error,
        refreshResources: fetchResources,
        addResource,
        updateResource,
        removeResource,
        getResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const ctx = useContext(ResourceContext);
  if (!ctx) throw new Error('useResources must be used within a ResourceProvider');
  return ctx;
};
