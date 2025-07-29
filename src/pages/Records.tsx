import { useState } from 'react';
import { RecordForm } from '@/components/records/RecordForm';
import { RecordList } from '@/components/records/RecordList';
import { ResourceRecord } from '@/types/iris';

export const Records = () => {
  const [editingRecord, setEditingRecord] = useState<ResourceRecord | undefined>();

  const handleEdit = (record: ResourceRecord) => {
    setEditingRecord(record);
  };

  const handleSave = () => {
    setEditingRecord(undefined);
  };

  const handleCancel = () => {
    setEditingRecord(undefined);
  };

  return (
    <div className="space-y-6">
      <RecordForm 
        editingRecord={editingRecord}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <RecordList onEdit={handleEdit} />
    </div>
  );
};
