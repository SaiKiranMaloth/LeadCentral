import React, { useState } from 'react';
import { X, GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  visible: boolean;
  preferred: boolean;
}

interface ColumnPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (columns: Column[]) => void;
}

export const ColumnPreferencesModal: React.FC<ColumnPreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', visible: true, preferred: true },
    { id: 'phone', label: 'Phone', visible: true, preferred: true },
    { id: 'email', label: 'E Mail', visible: true, preferred: true },
    { id: 'address', label: 'Address', visible: true, preferred: true },
    { id: 'type', label: 'Type', visible: true, preferred: true },
    { id: 'category', label: 'Category', visible: true, preferred: true },
    { id: 'contact', label: 'Contact', visible: true, preferred: true },
    { id: 'agent', label: 'Agent', visible: false, preferred: false },
    { id: 'source', label: 'Source', visible: false, preferred: false },
    { id: 'status', label: 'Status', visible: false, preferred: false },
    { id: 'secondarySource', label: 'Secondary Source', visible: false, preferred: false },
    { id: 'thirdSource', label: 'Third Source', visible: false, preferred: false }
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, visible: !col.visible, preferred: col.id === columnId ? !col.visible : col.preferred }
        : col
    ));
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedItem(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = columns.findIndex(col => col.id === draggedItem);
    const targetIndex = columns.findIndex(col => col.id === targetId);

    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    setColumns(newColumns);
    setDraggedItem(null);
  };

  const resetToDefault = () => {
    setColumns([
      { id: 'name', label: 'Name', visible: true, preferred: true },
      { id: 'phone', label: 'Phone', visible: true, preferred: true },
      { id: 'email', label: 'E Mail', visible: true, preferred: true },
      { id: 'address', label: 'Address', visible: true, preferred: true },
      { id: 'type', label: 'Type', visible: true, preferred: true },
      { id: 'category', label: 'Category', visible: true, preferred: true },
      { id: 'contact', label: 'Contact', visible: true, preferred: true },
      { id: 'agent', label: 'Agent', visible: false, preferred: false },
      { id: 'source', label: 'Source', visible: false, preferred: false },
      { id: 'status', label: 'Status', visible: false, preferred: false },
      { id: 'secondarySource', label: 'Secondary Source', visible: false, preferred: false },
      { id: 'thirdSource', label: 'Third Source', visible: false, preferred: false }
    ]);
  };

  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  if (!isOpen) return null;

  const preferredColumns = columns.filter(col => col.preferred);
  const otherColumns = columns.filter(col => !col.preferred);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Available Columns</h3>
            <p className="text-sm text-gray-600 mt-1">Customize which columns appear in your leads table</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Preferred Columns Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Preferred Columns</h4>
              <span className="text-sm text-gray-500">{preferredColumns.length} selected</span>
            </div>
            
            <div className="space-y-2">
              {preferredColumns.map((column) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors cursor-move group"
                >
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{column.label}</span>
                        <span className="text-sm text-indigo-600 ml-2">(Preferred)</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleColumnVisibility(column.id)}
                    className="p-2 text-indigo-600 hover:bg-indigo-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Other Available Columns Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Other Available Columns</h4>
              <span className="text-sm text-gray-500">{otherColumns.length} available</span>
            </div>
            
            <div className="space-y-2">
              {otherColumns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="font-medium text-gray-700">{column.label}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleColumnVisibility(column.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      column.visible 
                        ? 'text-indigo-600 hover:bg-indigo-100' 
                        : 'text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {column.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-medium">Reset to Default</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};