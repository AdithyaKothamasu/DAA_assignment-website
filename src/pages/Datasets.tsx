export function Datasets() {
  // Define dataset information
  const datasets = [
    {
      id: 'wikivote',
      name: 'Wikipedia Vote Network',
      description: 'Network of Wikipedia users voting for admin positions',
      downloadUrl: `${import.meta.env.BASE_URL}datasets/WikiVote.txt.gz`
    },
    {
      id: 'email-enron',
      name: 'Email-Enron',
      description: 'Email communication network from Enron corporation',
      downloadUrl: `${import.meta.env.BASE_URL}datasets/Email-Enron.txt.gz`
    },
    {
      id: 'skitter',
      name: 'AS-Skitter',
      description: 'Internet topology graph collected by traceroute measurements',
      downloadUrl: `${import.meta.env.BASE_URL}datasets/skitter.txt.gz`
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Datasets</h2>
      <div className="space-y-4">
        {datasets.map((dataset) => (
          <a
            key={dataset.id}
            href={dataset.downloadUrl}
            download
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{dataset.name}</h3>
                <p className="text-sm text-gray-500">{dataset.description}</p>
              </div>
              <span className="text-indigo-600 hover:text-indigo-700">Download</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
