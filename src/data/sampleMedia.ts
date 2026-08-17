export interface SampleDoc {
  name: string;
  type: string;
  size: string;
  pages: number;
  icon: string;
  url: string;
}

export interface SamplePhoto {
  url: string;
  caption?: string;
  thumbnail: string;
}

export interface SampleVideo {
  url: string;
  thumbnail: string;
  duration: string;
  title: string;
}

export interface SampleLink {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  domain: string;
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    name: 'Q3_Product_Roadmap_2026.pdf',
    type: 'PDF',
    size: '4.2 MB',
    pages: 18,
    icon: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    name: 'Design_System_Spec_v3.2.pdf',
    type: 'PDF',
    size: '12.8 MB',
    pages: 42,
    icon: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    name: 'Financial_Forecast_Annual.xlsx',
    type: 'XLSX',
    size: '1.4 MB',
    pages: 4,
    icon: 'sheet',
    url: '#',
  },
  {
    name: 'Master_Service_Agreement_Signed.pdf',
    type: 'PDF',
    size: '850 KB',
    pages: 6,
    icon: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    name: 'App_Architecture_Diagram.png',
    type: 'PNG',
    size: '2.1 MB',
    pages: 1,
    icon: 'image',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
];

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    caption: 'Sunset at the beach 🌊🌅',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80',
    caption: 'Mountain trekking adventure 🏔️',
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80',
    caption: 'Cozy dinner spot in the city 🍝🍷',
  },
  {
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=300&auto=format&fit=crop&q=80',
    caption: 'Road trip across the coast 🚗✨',
  },
  {
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop&q=80',
    caption: 'Morning walk through the misty pine forest 🌲',
  },
  {
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&auto=format&fit=crop&q=80',
    caption: 'Vintage car meet 🚙',
  },
];

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    duration: '0:15',
    title: 'Campfire by the lake 🔥',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    duration: '0:12',
    title: 'Waterfall drone capture 🌊',
  },
];

export const SAMPLE_LINKS: SampleLink[] = [
  {
    url: 'https://github.com/facebook/react',
    title: 'GitHub - facebook/react: The library for web and native user interfaces',
    description: 'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=300&auto=format&fit=crop&q=80',
    domain: 'github.com',
  },
  {
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.',
    description: 'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80',
    domain: 'tailwindcss.com',
  },
  {
    url: 'https://vitejs.dev',
    title: 'Vite | Next Generation Frontend Tooling',
    description: 'Get ready for a development environment that can finally catch up with you.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
    domain: 'vitejs.dev',
  },
];
