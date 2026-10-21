import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as requestService from '../services/requestService';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const addRequest = async (requestData) => {
    const newReq = await requestService.createRequest(requestData);
    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const offerHelp = async (requestId, userId) => {
    const updated = await requestService.offerHelp(requestId, userId);
    setRequests((prev) =>
      prev.map((r) => (r.id === Number(requestId) ? updated : r))
    );
    return updated;
  };

  const removeRequest = async (id) => {
    await requestService.deleteRequest(id);
    setRequests((prev) => prev.filter((r) => r.id !== Number(id)));
    return true;
  };

  const getRequest = useCallback(
    (id) => {
      return requests.find((r) => r.id === Number(id)) || null;
    },
    [requests]
  );

  return (
    <RequestContext.Provider
      value={{
        requests,
        loading,
        error,
        refreshRequests: fetchRequests,
        addRequest,
        offerHelp,
        removeRequest,
        getRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequests must be used within a RequestProvider');
  return ctx;
};
