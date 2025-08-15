
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Ensures that a library loaded from a CDN is available on the window object.
 * @param libraryName The name of the library on the window object (e.g., 'pdfjsLib').
 * @param timeout The maximum time to wait in milliseconds.
 * @returns A promise that resolves when the library is found, or rejects on timeout.
 */
const ensureLibraryIsLoaded = (libraryName: string, timeout = 8000): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any)[libraryName]) {
            return resolve();
        }

        let attempts = 0;
        const maxAttempts = timeout / 100; // Check every 100ms
        const interval = setInterval(() => {
            if ((window as any)[libraryName]) {
                clearInterval(interval);
                resolve();
            } else {
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    reject(new Error(`Failed to load essential library: ${libraryName}.`));
                }
            }
        }, 100);
    });
};

/**
 * Renders the main React application.
 */
const renderApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Could not find root element to mount to");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
};

/**
 * Displays a user-friendly error message in the DOM.
 * @param error The error that occurred.
 */
const renderError = (error: Error) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <div class="flex items-center justify-center min-h-screen">
              <div class="bg-surface p-8 rounded-lg shadow-lg text-center max-w-lg">
                <h1 class="text-2xl font-bold text-red-400 mb-4">Application Failed to Load</h1>
                <p class="text-on-surface mb-2">${error.message}</p>
                <p class="text-gray-400">This can happen due to a poor network connection or a content blocker. Please try refreshing the page or checking your connection.</p>
              </div>
            </div>
        `;
    }
};

// Ensure all critical external libraries are loaded before starting the app.
Promise.all([
    ensureLibraryIsLoaded('pdfjsLib'),
    ensureLibraryIsLoaded('jspdf'),
])
.then(() => {
    // Configure pdf.js worker once the library is loaded. This is a critical step.
    const pdfjsLib = (window as any).pdfjsLib;
    if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
    renderApp();
})
.catch((error) => {
    console.error("Library loading failed:", error);
    renderError(error);
});
