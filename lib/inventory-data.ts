export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
}

export const inventoryData: InventoryItem[] = [
  // Pig Feeds
  { id: 1, name: 'Premium Pig Starter Feed', category: 'Pig Feeds', stock: 25 },
  { id: 2, name: 'Pig Grower Pellets', category: 'Pig Feeds', stock: 0 },
  { id: 3, name: 'Sow Lactation Feed', category: 'Pig Feeds', stock: 18 },
  { id: 4, name: 'Pig Finisher Feed', category: 'Pig Feeds', stock: 12 },
  { id: 5, name: 'Organic Pig Feed Mix', category: 'Pig Feeds', stock: 8 },

  // Chicken Feeds
  { id: 6, name: 'Layer Chicken Feed', category: 'Chicken Feeds', stock: 45 },
  { id: 7, name: 'Broiler Starter Crumbles', category: 'Chicken Feeds', stock: 0 },
  { id: 8, name: 'Chicken Scratch Grains', category: 'Chicken Feeds', stock: 32 },
  { id: 9, name: 'Organic Layer Pellets', category: 'Chicken Feeds', stock: 15 },
  { id: 10, name: 'Chick Starter Feed', category: 'Chicken Feeds', stock: 28 },
  { id: 11, name: 'Free Range Chicken Feed', category: 'Chicken Feeds', stock: 0 },

  // Cattle
  { id: 12, name: 'Cattle Grain Mix', category: 'Cattle', stock: 67 },
  { id: 13, name: 'Dairy Cow Feed', category: 'Cattle', stock: 23 },
  { id: 14, name: 'Beef Cattle Pellets', category: 'Cattle', stock: 0 },
  { id: 15, name: 'Calf Starter Feed', category: 'Cattle', stock: 19 },
  { id: 16, name: 'Cattle Mineral Supplement', category: 'Cattle', stock: 14 },
  { id: 17, name: 'Hay Cubes for Cattle', category: 'Cattle', stock: 35 },

  // Goat
  { id: 18, name: 'Goat Feed Pellets', category: 'Goat', stock: 22 },
  { id: 19, name: 'Kid Goat Starter', category: 'Goat', stock: 0 },
  { id: 20, name: 'Dairy Goat Feed', category: 'Goat', stock: 16 },
  { id: 21, name: 'Goat Mineral Mix', category: 'Goat', stock: 11 },
  { id: 22, name: 'Meat Goat Feed', category: 'Goat', stock: 29 },

  // Rabbit
  { id: 23, name: 'Rabbit Pellets', category: 'Rabbit', stock: 38 },
  { id: 24, name: 'Baby Rabbit Feed', category: 'Rabbit', stock: 0 },
  { id: 25, name: 'Breeding Rabbit Feed', category: 'Rabbit', stock: 21 },
  { id: 26, name: 'Timothy Hay Pellets', category: 'Rabbit', stock: 17 },
  { id: 27, name: 'Rabbit Treat Mix', category: 'Rabbit', stock: 26 },

  // Fish
  { id: 28, name: 'Fish Floating Pellets', category: 'Fish', stock: 44 },
  { id: 29, name: 'Catfish Feed', category: 'Fish', stock: 0 },
  { id: 30, name: 'Tilapia Starter Feed', category: 'Fish', stock: 31 },
  { id: 31, name: 'Koi Fish Food', category: 'Fish', stock: 18 },
  { id: 32, name: 'Aquaculture Feed Mix', category: 'Fish', stock: 25 },

  // Pet
  { id: 33, name: 'Premium Dog Food', category: 'Pet', stock: 52 },
  { id: 34, name: 'Cat Food Dry', category: 'Pet', stock: 0 },
  { id: 35, name: 'Bird Seed Mix', category: 'Pet', stock: 33 },
  { id: 36, name: 'Hamster Food Pellets', category: 'Pet', stock: 24 },
  { id: 37, name: 'Guinea Pig Feed', category: 'Pet', stock: 19 },
  { id: 38, name: 'Puppy Training Treats', category: 'Pet', stock: 0 },

  // Others
  { id: 39, name: 'Animal Salt Licks', category: 'Others', stock: 41 },
  { id: 40, name: 'Feed Supplements', category: 'Others', stock: 27 },
  { id: 41, name: 'Vitamin Premix', category: 'Others', stock: 0 },
  { id: 42, name: 'Probiotics for Animals', category: 'Others', stock: 15 },
  { id: 43, name: 'Feed Storage Containers', category: 'Others', stock: 8 },
  { id: 44, name: 'Animal Feed Scoops', category: 'Others', stock: 36 },
];