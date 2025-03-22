export function Datasets() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Datasets</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((datasetNum) => (
          <a
            key={datasetNum}
            href={`/datasets/dataset${datasetNum}.txt.gz`}
            download
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Dataset {datasetNum}</h3>
                <p className="text-sm text-gray-500">Sample dataset for testing</p>
              </div>
              <span className="text-indigo-600 hover:text-indigo-700">Download</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
