import { useState } from 'react';
import { RecordForm } from './RecordForm';
import { RecordList } from './RecordList';
import { ResourceRecord } from '@/types/iris';

export const RecordsManagement = () => {
  const [editingRecord, setEditingRecord] = useState<ResourceRecord | undefined>();

  const handleEdit = (record: ResourceRecord) => {
    setEditingRecord(record);
  };

  const handleSave = () => {
    setEditingRecord(undefined);
  };

  return (
    <div className="space-y-6">
      <RecordForm 
        editingRecord={editingRecord} 
        onSave={handleSave}
      />
      <RecordList onEdit={handleEdit} />
    </div>
  );
};