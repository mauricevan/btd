// Mock data voor producten
let products = [
  {
    id: 1,
    name: "Smart Lock Pro",
    articleNumber: "SL-001",
    description: "Geavanceerde smart lock met vingerafdruk en PIN-code",
    category: "Smart Locks",
    purchasePrice: 89.99,
    sellingPrice: 149.99,
    btwPercentage: 21,
    priceInclBtw: 181.49,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 15,
    minStock: 5,
    isLowStock: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: 2,
    name: "CCTV Camera HD",
    articleNumber: "CC-002",
    description: "1080p HD beveiligingscamera met nachtzicht",
    category: "CCTV",
    purchasePrice: 45.50,
    sellingPrice: 79.99,
    btwPercentage: 21,
    priceInclBtw: 96.79,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 3,
    minStock: 5,
    isLowStock: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  },
  {
    id: 3,
    name: "Alarmsysteem Basis",
    articleNumber: "AS-003",
    description: "Complete alarmset voor thuis of kantoor",
    category: "Alarmsystemen",
    purchasePrice: 120.00,
    sellingPrice: 199.99,
    btwPercentage: 21,
    priceInclBtw: 241.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 8,
    minStock: 3,
    isLowStock: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15"
  },
  {
    id: 4,
    name: "Toegangscontrole RFID",
    articleNumber: "TC-004",
    description: "RFID kaartlezer voor bedrijfstoegang",
    category: "Toegangscontrole",
    purchasePrice: 75.00,
    sellingPrice: 129.99,
    btwPercentage: 21,
    priceInclBtw: 157.29,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 12,
    minStock: 4,
    isLowStock: false,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19"
  }
];

// Simuleer API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Bereken prijs inclusief BTW
const calculatePriceInclBtw = (priceExcl, btwPercentage) => {
  return priceExcl * (1 + btwPercentage / 100);
};

// Controleer lage voorraad
const isLowStock = (stock, minStock) => {
  return stock <= minStock;
};

export const productService = {
  // Haal alle producten op
  async getProducts() {
    await delay(300);
    return [...products];
  },

  // Haal één product op
  async getProduct(id) {
    await delay(200);
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product niet gevonden');
    }
    return product;
  },

  // Voeg nieuw product toe
  async addProduct(productData) {
    await delay(400);
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...productData,
      priceInclBtw: calculatePriceInclBtw(productData.sellingPrice, productData.btwPercentage),
      isLowStock: isLowStock(productData.stock, productData.minStock),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    products.push(newProduct);
    return newProduct;
  },

  // Update product
  async updateProduct(id, productData) {
    await delay(400);
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product niet gevonden');
    }
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      priceInclBtw: calculatePriceInclBtw(productData.sellingPrice, productData.btwPercentage),
      isLowStock: isLowStock(productData.stock, productData.minStock),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    products[index] = updatedProduct;
    return updatedProduct;
  },

  // Verwijder product
  async deleteProduct(id) {
    await delay(300);
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product niet gevonden');
    }
    
    const deletedProduct = products[index];
    products = products.filter(p => p.id !== parseInt(id));
    return deletedProduct;
  },

  // Zoek producten
  async searchProducts(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.articleNumber.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },

  // Filter producten op categorie
  async filterProductsByCategory(category) {
    await delay(200);
    if (category === 'all') return [...products];
    return products.filter(product => product.category === category);
  },

  // Filter producten met lage voorraad
  async getLowStockProducts() {
    await delay(200);
    return products.filter(product => product.isLowStock);
  },

  // Update voorraad
  async updateStock(id, newStock) {
    await delay(300);
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product niet gevonden');
    }
    
    if (newStock < 0) {
      throw new Error('Voorraad kan niet negatief zijn');
    }
    
    product.stock = newStock;
    product.isLowStock = isLowStock(newStock, product.minStock);
    product.updatedAt = new Date().toISOString().split('T')[0];
    
    return product;
  },

  // Bereken prijs inclusief BTW
  calculatePriceInclBtw,

  // Controleer lage voorraad
  isLowStock,

  // Haal alle categorieën op
  async getCategories() {
    await delay(100);
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  }
}; 