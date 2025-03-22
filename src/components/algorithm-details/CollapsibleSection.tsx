import React, { ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface CollapsibleSectionProps {
  title: string;
  id: string;
  isExpanded: boolean;
  toggleExpanded: () => void;
  children: ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  id,
  isExpanded,
  toggleExpanded,
  children
}) => {
  return (
    <div className="mb-4 border rounded-lg">
      <button
        id={id}
        onClick={toggleExpanded}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left font-medium rounded-t-lg focus:outline-none"
      >
        <span>{title}</span>
        {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};
