import { useState, useEffect } from 'react';
import { ResourceRecord, AuditLog } from '@/types/iris';
import { useLocalStorage } from './useLocalStorage';
import { generateSampleData } from '@/utils/sampleData';

export const useResources = () => {
  const [resources, setResources] = useLocalStorage<ResourceRecord[]>('iris_resources', []);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('iris_audit_logs', []);

  // Initialize with sample data if no data exists
  useEffect(() => {
    if (resources.length === 0) {
      const sampleData = generateSampleData();
      createResourcesBatch(sampleData);
    }
  }, []);

  const addAuditLog = (action: AuditLog['action'], resourceId: string, resourceType: string, oldValues?: any, newValues?: any) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      resourceId,
      resourceType,
      oldValues,
      newValues,
      timestamp: new Date().toISOString(),
      description: `${action} ${resourceType} record`
    };
    
    setAuditLogs(prev => [log, ...prev]);
  };

  const createResource = (data: Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResource: ResourceRecord = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setResources(prev => [newResource, ...prev]);
    addAuditLog('CREATE', newResource.id, newResource.type, undefined, newResource);
    
    return newResource;
  };

  const createResourcesBatch = (dataArray: Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newResources: ResourceRecord[] = dataArray.map((data, index) => ({
      ...data,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setResources(prev => [...newResources, ...prev]);
    
    // Add audit logs for batch creation
    newResources.forEach(resource => {
      addAuditLog('CREATE', resource.id, resource.type, undefined, resource);
    });
    
    return newResources;
  };

  const updateResource = (id: string, data: Partial<ResourceRecord>) => {
    const oldResource = resources.find(r => r.id === id);
    if (!oldResource) return null;

    const updatedResource = {
      ...oldResource,
      ...data,
      updatedAt: new Date().toISOString()
    };

    setResources(prev => prev.map(r => r.id === id ? updatedResource : r));
    addAuditLog('UPDATE', id, oldResource.type, oldResource, updatedResource);
    
    return updatedResource;
  };

  const deleteResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (!resource) return false;

    setResources(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE', id, resource.type, resource, undefined);
    
    return true;
  };

  const getResourcesByType = (type: ResourceRecord['type']) => {
    return resources.filter(r => r.type === type);
  };

  const getResourcesByDateRange = (startDate: string, endDate: string) => {
    return resources.filter(r => r.date >= startDate && r.date <= endDate);
  };

  return {
    resources,
    auditLogs,
    createResource,
    createResourcesBatch,
    updateResource,
    deleteResource,
    getResourcesByType,
    getResourcesByDateRange
  };
};