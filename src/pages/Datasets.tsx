import React from 'react';

interface Dataset {
  name: string;
  description: string; // Add a brief description if available, otherwise leave empty
  filePath: string;
}

const datasets: Dataset[] = [
  {
    name: "AS-Caida",
    description: "CAIDA AS Relationships Dataset",
    filePath: "public/code/as-caida.txt",
  },
  {
    name: "AS733",
    description: "Autonomous Systems graph AS733",
    filePath: "public/code/as733.txt",
  },
  {
    name: "Yeast",
    description: "Yeast protein interaction network",
    filePath: "public/code/yeast.txt",
  },
  {
    name: "Net Science",
    description: "Collaboration network of network scientists",
    filePath: "public/code/net science.txt",
  },
  {
    name: "Ca-HepTh",
    description: "High energy physics theory collaboration network",
    filePath: "public/code/Ca-Hepth.txt",
  },
  // Add more datasets here if needed
];

export const Datasets: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Datasets Used</h2>
      <ul className="divide-y divide-gray-200">
        {datasets.map((dataset, index) => (
          <li key={index} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-indigo-600 truncate">{dataset.name}</p>
                <p className="text-sm text-gray-500">{dataset.description}</p>
              </div>
              <a
                href={`${import.meta.env.BASE_URL}${dataset.filePath}`}
                download
                className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};