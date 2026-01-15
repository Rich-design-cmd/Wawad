import { carsAPI } from './api.js';

export class QRScanner {
    constructor(options = {}) {
        this.options = {
            target: options.target || '#qr-reader',
            onScan: options.onScan || null,
            onError: options.onError || null
        };
        this.isScanning = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.canvasContext = null;
        this.stream = null;
    }

    async start() {
        try {
            this.isScanning = true;
            
            // Create video element
            this.videoElement = document.createElement('video');
            this.videoElement.setAttribute('playsinline', 'true');
            
            // Create canvas for processing
            this.canvasElement = document.createElement('canvas');
            this.canvasContext = this.canvasElement.getContext('2d');
            
            // Get video stream
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            
            this.videoElement.srcObject = this.stream;
            
            // Add to target container
            const container = document.querySelector(this.options.target);
            if (container) {
                container.innerHTML = '';
                container.appendChild(this.videoElement);
                
                // Add scanning overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: absolute;
                    top: 25%;
                    left: 25%;
                    width: 50%;
                    height: 50%;
                    border: 2px solid #3B82F6;
                    box-shadow: 0 0 0 1000px rgba(0,0,0,0.7);
                    z-index: 10;
                `;
                container.style.position = 'relative';
                container.appendChild(overlay);
            }
            
            await this.videoElement.play();
            
            // Start scanning loop
            this.scanLoop();
            
        } catch (error) {
            console.error('QR Scanner error:', error);
            if (this.options.onError) {
                this.options.onError(error);
            }
            // Fallback to mock scanner for demo
            this.mockScanner();
        }
    }

    async scanLoop() {
        if (!this.isScanning) return;
        
        // Check video is ready
        if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
            // Set canvas dimensions to match video
            this.canvasElement.height = this.videoElement.videoHeight;
            this.canvasElement.width = this.videoElement.videoWidth;
            
            // Draw video frame to canvas
            this.canvasContext.drawImage(
                this.videoElement,
                0, 0,
                this.canvasElement.width,
                this.canvasElement.height
            );
            
            // Get image data for QR detection
            const imageData = this.canvasContext.getImageData(
                0, 0,
                this.canvasElement.width,
                this.canvasElement.height
            );
            
            // Try to detect QR code
            const qrData = this.detectQRCode(imageData);
            
            if (qrData && this.options.onScan) {
                this.options.onScan(qrData);
                this.stop();
            }
        }
        
        // Continue scanning
        requestAnimationFrame(() => this.scanLoop());
    }

    detectQRCode(imageData) {
        // This is a simplified version - in production, use a library like jsQR
        // For demo purposes, we'll simulate detection
        return null; // Returns null for real implementation
    }

    mockScanner() {
        // Mock scanner for demo
        const container = document.querySelector(this.options.target);
        if (!container) return;
        
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8">
                <div class="w-64 h-64 border-4 border-blue-500 border-dashed rounded-lg flex items-center justify-center mb-4">
                    <i class="fas fa-qrcode text-6xl text-blue-500"></i>
                </div>
                <p class="text-gray-600 text-center mb-4">
                    For demo purposes, click the button below to simulate QR scanning
                </p>
                <button id="mock-scan-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transform hover:-translate-y-1 transition duration-300">
                    Simulate QR Scan
                </button>
            </div>
        `;
        
        document.getElementById('mock-scan-btn').addEventListener('click', () => {
            const mockData = 'WC-2023-001'; // Mock QR data
            if (this.options.onScan) {
                this.options.onScan(mockData);
            }
        });
    }

    stop() {
        this.isScanning = false;
        
        // Stop video stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        // Clear elements
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }
}

// Initialize QR Scanner on page
export function initQRScanner() {
    const qrButton = document.getElementById('qr-scan-button');
    const scannerModal = document.getElementById('qr-scanner-modal');
    const closeScanner = document.getElementById('close-scanner');
    const qrResult = document.getElementById('qr-result');
    
    if (!qrButton || !scannerModal) return;
    
    let scanner = null;
    
    qrButton.addEventListener('click', () => {
        scannerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            scanner = new QRScanner({
                target: '#qr-reader',
                onScan: (data) => {
                    qrResult.innerHTML = `
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <p class="font-bold">QR Code Scanned!</p>
                            <p>License: ${data}</p>
                            <button onclick="searchByQR('${data}')" class="mt-2 text-green-700 hover:text-green-900 font-medium">
                                <i class="fas fa-search mr-1"></i>
                                Search for this wirecar
                            </button>
                        </div>
                    `;
                },
                onError: (error) => {
                    qrResult.innerHTML = `
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p class="font-bold">Scanner Error</p>
                            <p>${error.message || 'Camera access denied. Using mock scanner.'}</p>
                        </div>
                    `;
                }
            });
            
            scanner.start();
        }, 100);
    });
    
    closeScanner.addEventListener('click', () => {
        scannerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        if (scanner) {
            scanner.stop();
        }
        qrResult.textContent = '';
    });
    
    // Close on outside click
    scannerModal.addEventListener('click', (e) => {
        if (e.target === scannerModal) {
            scannerModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            if (scanner) {
                scanner.stop();
            }
        }
    });
}

// Global function to search by QR
window.searchByQR = async function(license) {
    try {
        const cars = await carsAPI.search(license);
        if (cars.length > 0) {
            // Show car details in modal
            const car = cars[0];
            const resultDiv = document.getElementById('qr-result');
            resultDiv.innerHTML = `
                <div class="bg-white border border-gray-300 rounded-lg p-4">
                    <h4 class="font-bold text-lg mb-2">Wirecar Found!</h4>
                    <p><strong>Title:</strong> ${car.title}</p>
                    <p><strong>License:</strong> ${car.license}</p>
                    <p><strong>Maker:</strong> ${car.makers}</p>
                    <p><strong>Location:</strong> ${car.city}, ${car.country}</p>
                    <p><strong>Year:</strong> ${car.year_built}</p>
                    <button onclick="viewCarDetail('${car.id}')" class="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                        View Full Details
                    </button>
                </div>
            `;
        } else {
            const resultDiv = document.getElementById('qr-result');
            resultDiv.innerHTML = `
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>No wirecar found with license: ${license}</p>
                    <p class="text-sm mt-2">Try searching manually or check the license number.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Search error:', error);
        const resultDiv = document.getElementById('qr-result');
        resultDiv.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Error searching for wirecar</p>
            </div>
        `;
    }
};

// Initialize QR scanner when page loads
if (document.getElementById('qr-scan-button')) {
    initQRScanner();
}