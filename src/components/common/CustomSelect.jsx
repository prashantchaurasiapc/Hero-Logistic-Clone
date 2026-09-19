import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format options into standard { label, value } array
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        label: opt.label !== undefined ? opt.label : (opt.name !== undefined ? opt.name : opt.value),
        value: opt.value !== undefined ? opt.value : (opt.name !== undefined ? opt.name : opt.label)
      };
    }
    return { label: String(opt), value: String(opt) };
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value)) ||
    (value ? { label: String(value), value } : null);

  return (
    <div className={`relative w-full text-left font-sans ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          `w-full px-4 py-3 bg-white border ${
            isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
          } rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed`
        }
      >
        <span className={`truncate ${selectedOption ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={
            dropdownClassName ||
            'absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-[999] max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5 animate-fade-in'
          }
        >
          {normalizedOptions.length > 0 ? (
            normalizedOptions.map((opt) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-black'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />}
                </button>
              );
            })
          ) : (
            <div className="px-3.5 py-2.5 text-xs text-slate-400 font-medium text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
