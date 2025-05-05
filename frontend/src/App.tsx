import React from 'react';

function App() {
  // Testovací stav na overenie volania API
  const [apiMessage, setApiMessage] = React.useState("Loading API status...");

  React.useEffect(() => {
    // Skús zavolať backend API po načítaní komponentu
    fetch('http://localhost:8000/') // Adresa backendu definovaná v docker-compose
      .then(response => response.json())
      .then(data => setApiMessage(data.message || "API responded, but no message found."))
      .catch(error => {
        console.error("Error fetching API:", error);
        setApiMessage("Could not connect to backend API.");
      });
  }, []); // Prázdne pole znamená, že sa useEffect spustí len raz po mountnutí

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        ColorBuddy 🎨
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Your AI Palette Magician!
      </p>
      <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
        <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
          Backend API status: <span className="font-semibold">{apiMessage}</span>
        </p>
      </div>
      {/* Tu pridáš ďalšie komponenty (Upload, PalettePreview, atď.) */}
    </div>
  );
}

export default App;