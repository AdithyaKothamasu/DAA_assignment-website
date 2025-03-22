interface Props {
  activeTab: string;
  onTabChange: (tab: 'overview' | 'datasets' | 'implementation') => void;
}

export function Header({ activeTab, onTabChange }: Props) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Maximal Clique Enumeration Algorithms and Analysis</h1>
          </div>
          <nav className="flex space-x-4">
            {['overview', 'implementation', 'datasets'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab as 'overview' | 'datasets' | 'implementation')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === tab
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
