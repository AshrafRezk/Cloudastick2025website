import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Building2, Briefcase, FolderKanban, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSalesforce } from '../contexts/SalesforceContext';
import { useToast } from '../hooks/use-toast';

export interface SalesforceRecord {
  id: string;
  name: string;
  type: 'Opportunity' | 'Project' | 'Account';
  accountName?: string;
  accountId?: string;
  accountIndustry?: string;
  accountWebsite?: string;
  opportunityName?: string;
  opportunityId?: string;
  additionalInfo?: string;
}

interface SalesforceLookupProps {
  value?: string;
  onChange: (record: SalesforceRecord | null) => void;
  objectType: 'Opportunity' | 'SFDC_Project__c' | 'Account';
  placeholder?: string;
  label?: string;
  className?: string;
}

const SalesforceLookup: React.FC<SalesforceLookupProps> = ({
  value,
  onChange,
  objectType,
  placeholder,
  label,
  className = '',
}) => {
  const { authData, isLoading: authLoading } = useSalesforce();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SalesforceRecord[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalesforceRecord | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get display name for object type
  const getObjectTypeName = () => {
    switch (objectType) {
      case 'Opportunity':
        return 'Opportunity';
      case 'SFDC_Project__c':
        return 'Project';
      case 'Account':
        return 'Account';
      default:
        return 'Record';
    }
  };

  // Get icon for object type
  const getObjectIcon = () => {
    switch (objectType) {
      case 'Opportunity':
        return Briefcase;
      case 'SFDC_Project__c':
        return FolderKanban;
      case 'Account':
        return Building2;
      default:
        return Building2;
    }
  };

  const Icon = getObjectIcon();

  // Search Salesforce records
  const searchRecords = async (term: string) => {
    if (!authData || !term || term.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/.netlify/functions/searchSalesforceRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: authData.access_token,
          instance_url: authData.instance_url,
          searchTerm: term.trim(),
          objectType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search records');
      }

      const data = await response.json();
      setResults(data.records || []);
      setShowResults(true);
    } catch (error: any) {
      console.error('Error searching Salesforce records:', error);
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search Salesforce records',
        variant: 'destructive',
      });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm && searchTerm.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchRecords(searchTerm);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, authData]);

  // Handle record selection
  const handleSelectRecord = (record: SalesforceRecord) => {
    setSelectedRecord(record);
    setSearchTerm(record.name);
    setShowResults(false);
    onChange(record);
  };

  // Handle clear selection
  const handleClear = () => {
    setSelectedRecord(null);
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
    onChange(null);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If record is selected, show it
  const displayValue = selectedRecord ? selectedRecord.name : searchTerm;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="h-4 w-4" />
        </div>
        
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (selectedRecord) {
              setSelectedRecord(null);
              onChange(null);
            }
            if (e.target.value.length >= 2) {
              setShowResults(true);
            }
          }}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder || `Search ${getObjectTypeName()}...`}
          className={`pl-10 pr-10 bg-gray-800 border-gray-600 text-white ${selectedRecord ? 'pr-10' : ''}`}
          disabled={authLoading}
        />
        
        {selectedRecord && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {isSearching && !selectedRecord && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((record) => (
            <button
              key={record.id}
              onClick={() => handleSelectRecord(record)}
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{record.name}</div>
                  {record.additionalInfo && (
                    <div className="text-sm text-gray-400 mt-1">{record.additionalInfo}</div>
                  )}
                  {record.accountName && (
                    <div className="text-xs text-gray-500 mt-1">Account: {record.accountName}</div>
                  )}
                </div>
                <div className="text-xs text-cyan-400 flex-shrink-0">{record.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && searchTerm.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-400">
          No {getObjectTypeName().toLowerCase()}s found
        </div>
      )}

      {authLoading && (
        <div className="mt-2 text-xs text-gray-500">Connecting to Salesforce...</div>
      )}
    </div>
  );
};

export default SalesforceLookup;

