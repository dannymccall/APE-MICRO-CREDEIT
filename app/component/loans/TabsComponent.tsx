import React, { JSX, useState } from "react";

interface Tab {
  label: string;
  content: JSX.Element | string; // Content for each tab
}

interface TabComponentProps {
  tabs: Tab[];
  initialTab?: number; // Optional initial tab index
}

const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  initialTab = 0,
}) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`tab font-mono transition duration-300 ease-in-out ${
              activeTab === index
                ? "bg-violet-900 text-white rounded-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 border w-full rounded-md">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabComponent;
