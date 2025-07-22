// Mock data voor klanten
let customers = [
  {
    id: 1,
    name: "Jan Jansen",
    email: "jan.jansen@email.nl",
    phone: "06-12345678",
    type: "particulier",
    address: "Hoofdstraat 123, 3311 AA Dordrecht",
    notes: "Klant heeft interesse in beveiligingscamera's voor thuis",
    products: ["CCTV Camera", "Smart Lock"],
    createdAt: "2024-01-15",
    lastContact: "2024-01-20"
  },
  {
    id: 2,
    name: "Bouwbedrijf Van der Berg",
    email: "info@bouwbedrijf.nl",
    phone: "078-1234567",
    type: "bedrijf",
    address: "Industrieweg 45, 3312 AB Dordrecht",
    notes: "Grote klant, regelmatige onderhoudscontracten",
    products: ["Toegangscontrole", "Alarmsysteem", "CCTV"],
    createdAt: "2023-11-10",
    lastContact: "2024-01-18"
  },
  {
    id: 3,
    name: "Maria de Vries",
    email: "maria.devries@hotmail.com",
    phone: "06-87654321",
    type: "particulier",
    address: "Kerkstraat 67, 3313 AC Dordrecht",
    notes: "Nieuwe klant, heeft slot vervangen nodig",
    products: ["Smart Lock"],
    createdAt: "2024-01-22",
    lastContact: "2024-01-22"
  }
];

// Simuleer API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  // Haal alle klanten op
  async getCustomers() {
    await delay(300);
    return [...customers];
  },

  // Haal één klant op
  async getCustomer(id) {
    await delay(200);
    const customer = customers.find(c => c.id === parseInt(id));
    if (!customer) {
      throw new Error('Klant niet gevonden');
    }
    return customer;
  },

  // Voeg nieuwe klant toe
  async addCustomer(customerData) {
    await delay(400);
    const newCustomer = {
      id: Math.max(...customers.map(c => c.id)) + 1,
      ...customerData,
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      products: customerData.products || []
    };
    customers.push(newCustomer);
    return newCustomer;
  },

  // Update klant
  async updateCustomer(id, customerData) {
    await delay(400);
    const index = customers.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
      throw new Error('Klant niet gevonden');
    }
    
    customers[index] = {
      ...customers[index],
      ...customerData,
      lastContact: new Date().toISOString().split('T')[0]
    };
    
    return customers[index];
  },

  // Verwijder klant
  async deleteCustomer(id) {
    await delay(300);
    const index = customers.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
      throw new Error('Klant niet gevonden');
    }
    
    const deletedCustomer = customers[index];
    customers = customers.filter(c => c.id !== parseInt(id));
    return deletedCustomer;
  },

  // Zoek klanten
  async searchCustomers(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm)
    );
  },

  // Filter klanten op type
  async filterCustomersByType(type) {
    await delay(200);
    if (type === 'all') return [...customers];
    return customers.filter(customer => customer.type === type);
  },

  // Voeg notitie toe aan klant
  async addNote(customerId, note) {
    await delay(300);
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (!customer) {
      throw new Error('Klant niet gevonden');
    }
    
    const newNote = {
      id: Date.now(),
      text: note,
      date: new Date().toISOString(),
      author: 'Admin'
    };
    
    customer.notes = customer.notes ? 
      `${customer.notes}\n\n${new Date().toLocaleDateString('nl-NL')}: ${note}` :
      `${new Date().toLocaleDateString('nl-NL')}: ${note}`;
    
    customer.lastContact = new Date().toISOString().split('T')[0];
    
    return customer;
  }
}; 