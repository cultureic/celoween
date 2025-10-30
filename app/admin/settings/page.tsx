export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system settings and configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Version</h3>
            <p className="text-gray-900">1.0.0</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Environment</h3>
            <p className="text-gray-900">Development</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Database</h3>
            <p className="text-gray-900">PostgreSQL (Supabase)</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
            <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Seed Database</h3>
              <p className="text-sm text-gray-600">Add sample categories, levels, and instructors</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Run Seed
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Clear Cache</h3>
              <p className="text-sm text-gray-600">Clear application cache and temporary files</p>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
              Clear Cache
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-600">Export all course data as JSON</p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}