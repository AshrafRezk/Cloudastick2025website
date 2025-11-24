import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Get plural form of object type name
  const getPluralObjectTypeName = () => {
    switch (objectType) {
      case 'Opportunity':
        return 'opportunities';
      case 'SFDC_Project__c':
        return 'projects';
      case 'Account':
        return 'accounts';
      default:
        return 'records';
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
  const searchRecords = useCallback(async (term: string) => {
    if (!term || term.trim().length < 2) {
      setResults([]);
      return;
    }

    // Validate authentication data
    if (!authData || !authData.access_token || !authData.instance_url) {
      toast({
        title: 'Authentication required',
        description: 'Please authenticate with Salesforce to search records.',
        variant: 'destructive',
      });
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
        // Try to parse error response as JSON, but handle non-JSON responses
        let errorMessage = `Search failed (${response.status})`;
        try {
          const errorText = await response.text();
          if (errorText) {
            // Check if response is HTML (common for 404 pages, etc.)
            const isHTML = /^\s*<(!DOCTYPE|html|!\[CDATA)/i.test(errorText.trim());
            
            if (isHTML) {
              // For HTML responses, provide a user-friendly message
              if (response.status === 404) {
                errorMessage = 'Search service not found. Please check your configuration.';
              } else if (response.status === 500) {
                errorMessage = 'Server error occurred. Please try again later.';
              } else {
                errorMessage = `Search failed: ${response.status} ${response.statusText || 'Unknown error'}`;
              }
            } else {
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || errorMessage;
              } catch {
                // If not JSON and not HTML, strip any HTML tags and use the text
                const strippedText = errorText.replace(/<[^>]*>/g, '').trim();
                if (strippedText && strippedText.length > 0) {
                  errorMessage = strippedText.length > 100 ? strippedText.substring(0, 100) + '...' : strippedText;
                }
              }
            }
          }
        } catch (textError) {
          // If we can't read the response, use status-based message
          errorMessage = `Search failed: ${response.status} ${response.statusText || 'Unknown error'}`;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      // Handle both direct records array and wrapped response format
      const records = data.records || (Array.isArray(data) ? data : []);
      setResults(records);
      setShowResults(true);
    } catch (error: any) {
      console.error('Error searching Salesforce records:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to search Salesforce records';
      if (error.message) {
        // Strip any remaining HTML tags from error message
        errorMessage = error.message.replace(/<[^>]*>/g, '').trim();
        // If message is still too long or contains HTML entities, provide a simpler message
        if (errorMessage.length > 200 || errorMessage.includes('&lt;') || errorMessage.includes('&gt;')) {
          if (errorMessage.includes('404') || errorMessage.includes('not found')) {
            errorMessage = 'Search service not available. Please try again later.';
          } else if (errorMessage.includes('500') || errorMessage.includes('server')) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else {
            errorMessage = 'Unable to search at this time. Please try again.';
          }
        }
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server';
      }
      
      toast({
        title: 'Search failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, [authData, objectType, toast]);

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
  }, [searchTerm, searchRecords]);

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
          No {getPluralObjectTypeName()} found
        </div>
      )}

      {authLoading && (
        <div className="mt-2 text-xs text-gray-500">Connecting to Salesforce...</div>
      )}
    </div>
  );
};

export default SalesforceLookup;

