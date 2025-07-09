import React, { useState, useEffect } from 'react';
import { X, GripVertical, Eye, EyeOff, RotateCcw, Check, Move } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

interface ColumnPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (columns: Column[]) => void;
  initialColumns: Column[];
}

export const ColumnPreferencesModal: React.FC<ColumnPreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialColumns
}) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setColumns(initialColumns);
    setHasChanges(false);
  }, [initialColumns, isOpen]);

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, visible: !col.visible }
        : col
    ));
    setHasChanges(true);
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedItem(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(columnId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = columns.findIndex(col => col.id === draggedItem);
    const targetIndex = columns.findIndex(col => col.id === targetId);

    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    // Update order values
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }));

    setColumns(updatedColumns);
    setDraggedItem(null);
    setDragOverItem(null);
    setHasChanges(true);
  };

  const resetToDefault = () => {
    const defaultColumns = [
      { id: 'name', label: 'Name', visible: true, order: 0 },
      { id: 'phone', label: 'Phone', visible: true, order: 1 },
      { id: 'email', label: 'E Mail', visible: true, order: 2 },
      { id: 'address', label: 'Address', visible: true, order: 3 },
      { id: 'type', label: 'Type', visible: true, order: 4 },
      { id: 'category', label: 'Category', visible: false, order: 5 },
      { id: 'agent', label: 'Agent', visible: false, order: 6 },
      { id: 'source', label: 'Source', visible: false, order: 7 },
      { id: 'status', label: 'Status', visible: false, order: 8 },
      { id: 'secondarySource', label: 'Secondary Source', visible: false, order: 9 },
      { id: 'thirdSource', label: 'Third Source', visible: false, order: 10 }
    ];
    setColumns(defaultColumns);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(columns);
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    setColumns(initialColumns);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
  const hiddenColumns = columns.filter(col => !col.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Column Preferences</h3>
            <p className="text-sm text-gray-600 mt-1">Customize and reorder your table columns</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Visible Columns */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Visible Columns
              </h4>
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                {visibleColumns.length} active
              </span>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-2">
              {visibleColumns.map((column, index) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 rounded-xl transition-all duration-200 cursor-move group hover:shadow-md ${
                    dragOverItem === column.id ? 'border-green-400 shadow-lg scale-105' : 'border-green-200'
                  } ${draggedItem === column.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                      <Move className="w-4 h-4" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{column.label}</span>
                        <div className="text-xs text-green-600 font-medium">Currently visible</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleColumnVisibility(column.id)}
                    className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Hide column"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {visibleColumns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <EyeOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No visible columns</p>
                  <p className="text-sm">Add columns from the right panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Hidden Columns */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                Available Columns
              </h4>
              <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full font-medium">
                {hiddenColumns.length} hidden
              </span>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-2">
              {hiddenColumns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{column.label}</span>
                      <div className="text-xs text-gray-500">Click to show</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleColumnVisibility(column.id)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Show column"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {hiddenColumns.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Check className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium">All columns visible</p>
                  <p className="text-sm">Hide columns to organize your view</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-medium">Reset to Default</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full font-medium">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-xl font-medium shadow-md transition-all ${
                hasChanges
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};