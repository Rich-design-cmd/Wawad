import { carsAPI } from './api.js';

export async function loadCars() {
    try {
        const cars = await carsAPI.getAll();
        displayCars(cars);
        updateFilters(cars);
    } catch (error) {
        console.error('Error loading cars:', error);
        document.getElementById('cars-gallery').innerHTML = `
            <div class="text-center py-12 col-span-full">
                <i class="fas fa-exclamation-circle text-4xl text-red-600 mb-4"></i>
                <p class="text-red-600">Failed to load wirecars</p>
                <button onclick="loadCars()" class="mt-4 text-blue-600 hover:text-blue-800">
                    <i class="fas fa-redo mr-1"></i>
                    Try Again
                </button>
            </div>
        `;
    }
}

function displayCars(cars) {
    const gallery = document.getElementById('cars-gallery');
    const count = document.getElementById('cars-count');
    
    count.textContent = `${cars.length} wirecars found`;
    
    if (cars.length === 0) {
        gallery.innerHTML = `
            <div class="text-center py-12 col-span-full">
                <i class="fas fa-car text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-600">No wirecars found</p>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = cars.map(car => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div class="relative h-48 overflow-hidden">
                <img src="${car.images?.[0] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'}" 
                     alt="${car.title}" 
                     class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                <div class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    ${car.license}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${car.title}</h3>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        ${car.city}, ${car.country}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-calendar mr-2"></i>
                        ${car.year_built}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-user mr-2"></i>
                        ${car.makers}
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    ${car.story || 'A beautiful handmade wirecar with intricate details.'}
                </p>
                <button onclick="viewCarDetail('${car.id}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-300 transform hover:-translate-y-1">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

function updateFilters(cars) {
    const countries = [...new Set(cars.map(car => car.country))].sort();
    const cities = [...new Set(cars.map(car => car.city))].sort();
    
    const countryFilter = document.getElementById('country-filter');
    const cityFilter = document.getElementById('city-filter');
    
    // Populate country filter
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
    
    // Populate city filter
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
    
    // Add filter event listeners
    const searchInput = document.getElementById('search-input');
    
    const applyFilters = async () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCountry = countryFilter.value;
        const selectedCity = cityFilter.value;
        
        try {
            let filteredCars = await carsAPI.getAll();
            
            // Apply filters
            if (searchTerm) {
                filteredCars = filteredCars.filter(car => 
                    car.title.toLowerCase().includes(searchTerm) ||
                    car.makers.toLowerCase().includes(searchTerm) ||
                    car.license.toLowerCase().includes(searchTerm)
                );
            }
            
            if (selectedCountry) {
                filteredCars = filteredCars.filter(car => car.country === selectedCountry);
            }
            
            if (selectedCity) {
                filteredCars = filteredCars.filter(car => car.city === selectedCity);
            }
            
            displayCars(filteredCars);
        } catch (error) {
            console.error('Filter error:', error);
        }
    };
    
    searchInput.addEventListener('input', applyFilters);
    countryFilter.addEventListener('change', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
}

// Global function to view car details
window.viewCarDetail = function(carId) {
    window.location.href = `car-detail.html?id=${carId}`;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCars();
});