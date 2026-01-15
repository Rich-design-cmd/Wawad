const API_BASE_URL = 'http://localhost:3000/api';

// Mock data for demonstration
const mockCars = [
    {
        id: 1,
        title: 'Red Speedster',
        license: 'WC-2023-001',
        country: 'South Africa',
        city: 'Cape Town',
        year_built: 2023,
        makers: 'Thomas Banda',
        story: 'A tribute to classic racing cars, this wire car features intricate detailing and a functional steering mechanism.',
        images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400']
    },
    {
        id: 2,
        title: 'Blue Pickup',
        license: 'WC-2022-045',
        country: 'Jamaica',
        city: 'Kingston',
        year_built: 2022,
        makers: 'Marcia Campbell',
        story: 'Inspired by local delivery trucks, this piece captures the essence of Caribbean craftsmanship.',
        images: ['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400']
    },
    {
        id: 3,
        title: 'Yellow Taxi',
        license: 'WC-2021-078',
        country: 'Ghana',
        city: 'Accra',
        year_built: 2021,
        makers: 'Kwame Asante',
        story: 'A vibrant representation of urban transportation in West Africa.',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400']
    },
    {
        id: 4,
        title: 'Silver Classic',
        license: 'WC-2023-112',
        country: 'Nigeria',
        city: 'Lagos',
        year_built: 2023,
        makers: 'Adebayo Okafor',
        story: 'Elegant vintage design with exceptional attention to detail.',
        images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400']
    },
    {
        id: 5,
        title: 'Green Off-Roader',
        license: 'WC-2022-089',
        country: 'Kenya',
        city: 'Nairobi',
        year_built: 2022,
        makers: 'Samuel Mwangi',
        story: 'Rugged design perfect for rough terrain, inspired by safari vehicles.',
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400']
    },
    {
        id: 6,
        title: 'Purple Racer',
        license: 'WC-2023-056',
        country: 'USA',
        city: 'Detroit',
        year_built: 2023,
        makers: 'James Wilson',
        story: 'Modern aerodynamic design with a striking purple finish.',
        images: ['https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=400']
    }
];

const mockEvents = [
    {
        id: 1,
        title: 'Detroit Wire Car Festival',
        description: 'Annual celebration of wire car art featuring exhibitions, workshops, and a showcase of master artisans.',
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        location_name: 'Sadza Space',
        address: '12449 Conant Street, Detroit MI 48212',
        latitude: 42.331427,
        longitude: -83.045754,
        images: []
    },
    {
        id: 2,
        title: 'Wire Car Workshop',
        description: 'Hands-on workshop for beginners and intermediate makers. Learn techniques from master craftsmen.',
        event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location_name: 'WAWAD Headquarters',
        address: 'Cape Town, South Africa',
        latitude: -33.9249,
        longitude: 18.4241,
        images: []
    },
    {
        id: 3,
        title: 'International Wire Car Exhibition',
        description: 'Showcase of wire cars from around the world, with awards for craftsmanship and innovation.',
        event_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        location_name: 'National Arts Gallery',
        address: 'Kingston, Jamaica',
        latitude: 18.0179,
        longitude: -76.8099,
        images: []
    }
];

export const api = {
    // Cars API
    cars: {
        getAll: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockCars;
        },
        
        getById: async (id) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            const car = mockCars.find(c => c.id === parseInt(id));
            if (!car) throw new Error('Car not found');
            return car;
        },
        
        search: async (query) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (!query) return mockCars;
            
            const searchTerm = query.toLowerCase();
            return mockCars.filter(car => 
                car.title.toLowerCase().includes(searchTerm) ||
                car.license.toLowerCase().includes(searchTerm) ||
                car.makers.toLowerCase().includes(searchTerm) ||
                car.country.toLowerCase().includes(searchTerm) ||
                car.city.toLowerCase().includes(searchTerm)
            );
        },
        
        submitCar: async (carData) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Car submitted:', carData);
            return { success: true, message: 'Car submitted successfully' };
        }
    },

    // Events API
    events: {
        getAll: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockEvents;
        },
        
        getUpcoming: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            const now = new Date();
            return mockEvents.filter(event => new Date(event.event_date) > now);
        },
        
        getPast: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            const now = new Date();
            return mockEvents.filter(event => new Date(event.event_date) <= now);
        }
    },

    // Forum API
    forum: {
        getThreads: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [];
        },
        
        getThreadById: async (id) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return null;
        },
        
        getPostsByThread: async (threadId) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return [];
        },
        
        createThread: async (threadData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { id: Date.now(), ...threadData };
        },
        
        createPost: async (postData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        }
    },

    // Garage/Manuals API
    manuals: {
        getAll: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [];
        },
        
        getById: async (id) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return null;
        },
        
        getByCategory: async (category) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return [];
        }
    },

    // Newsletter API
    newsletter: {
        subscribe: async (email) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simple validation
            if (!email.includes('@') || !email.includes('.')) {
                throw new Error('Invalid email address');
            }
            
            // Check if already subscribed (simulated)
            const subscribedEmails = JSON.parse(localStorage.getItem('subscribed_emails') || '[]');
            if (subscribedEmails.includes(email)) {
                throw new Error('Email already subscribed');
            }
            
            // Add to localStorage for demo
            subscribedEmails.push(email);
            localStorage.setItem('subscribed_emails', JSON.stringify(subscribedEmails));
            
            return { success: true, message: 'Subscribed successfully' };
        }
    },

    // Contact API
    contact: {
        sendMessage: async (messageData) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            console.log('Message received:', messageData);
            return { success: true, message: 'Message sent successfully' };
        }
    }
};

// Export individual modules for convenience
export const carsAPI = api.cars;
export const eventsAPI = api.events;
export const forumAPI = api.forum;
export const manualsAPI = api.manuals;
export const newsletterAPI = api.newsletter;
export const contactAPI = api.contact;

// Utility function for making real API calls
export async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
}