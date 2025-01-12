import React from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { IClient } from '@/app/lib/backend/models/client.model';

interface ClientSelectorProps {
  clients: IClient[];
  selectedClient?: IClient | null;
  isOpen: boolean;
  searchTerm: string;
  onClientSelect: (client: IClient) => void;
  onToggleDropdown: () => void;
  onSearchChange: (searchTerm: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClient,
  isOpen,
  searchTerm,
  onClientSelect,
  onToggleDropdown,
  onSearchChange,
}) => {
  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={onToggleDropdown}
        className="w-full px-5 py-2 flex justify-between text-sm border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {selectedClient
          ? `${selectedClient.first_name} ${selectedClient.last_name}`
          : 'Select client'}
        <MdOutlineKeyboardArrowDown size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full px-5 py-2 text-sm border-b border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* Client List */}
          <ul className="max-h-40 overflow-y-auto">
            {clients.length > 0 ? (
              clients.map((client) => (
                <li
                  key={client.systemId}
                  onClick={() => onClientSelect(client)}
                  className="px-5 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                >
                  {client.first_name} {client.last_name}
                </li>
              ))
            ) : (
              <li className="px-5 py-2 text-sm text-gray-500">
                No clients available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
