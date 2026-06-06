export interface Property {
    id: string;
    title: string;
    price: number;
    city: string;
    postalCode: string;
  
    surface: number;
    bedrooms: number;
    bathrooms: number;
  
    description: string;
  
    images: string[];
    virtualTour?: string;
  }