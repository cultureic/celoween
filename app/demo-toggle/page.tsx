import { FundingGuideToggle } from "@/components/academy/FundingGuideToggle";

export default function DemoTogglePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demostración del Toggle de Financiamiento
          </h1>
          <p className="text-lg text-gray-600">
            Haz clic en el título para expandir/contraer el contenido
          </p>
        </div>
        
        <div className="space-y-6">
          <FundingGuideToggle />
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Características del Componente
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                <strong>Accesible:</strong> Incluye atributos ARIA para lectores de pantalla
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <strong>Responsive:</strong> Se adapta a diferentes tamaños de pantalla
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                <strong>Formato Markdown:</strong> Renderiza correctamente encabezados, listas y texto en negrita
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                <strong>Interactivo:</strong> Animaciones suaves y estados hover
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
