import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/categoryModel.js";
import Menu from "./models/menuModel.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in .env file");
  process.exit(1);
}

const categoriesData = [
  {
    name: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pizzas",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pastas",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Others",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  },
];

const menuItemsData = [
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty, melted cheddar cheese, fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
    price: 249,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    categoryName: "Burgers",
  },
  {
    name: "Crispy Chicken Burger",
    description: "Crispy fried chicken breast, spicy mayo, dill pickles, and shredded lettuce on a toasted sesame seed bun.",
    price: 279,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    categoryName: "Burgers",
  },
  {
    name: "Margherita Pizza",
    description: "Classic Neapolitan style pizza with organic tomato sauce, fresh mozzarella cheese, fresh basil leaves, and a drizzle of extra virgin olive oil.",
    price: 349,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    categoryName: "Pizzas",
  },
  {
    name: "Pepperoni Feast Pizza",
    description: "Loaded double portion of spicy pepperoni slices, mozzarella cheese, and our signature herb-infused tomato sauce.",
    price: 449,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    categoryName: "Pizzas",
  },
  {
    name: "Creamy Alfredo Pasta",
    description: "Fettuccine pasta tossed in a rich, creamy parmesan cheese and garlic butter sauce, served with toasted garlic bread.",
    price: 399,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    categoryName: "Pastas",
  },
  {
    name: "Spicy Arrabbiata Pasta",
    description: "Penne pasta in a fiery tomato sauce with garlic, chili flakes, olives, and fresh parsley.",
    price: 329,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    categoryName: "Pastas",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate core, served with a scoop of premium vanilla ice cream.",
    price: 199,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    categoryName: "Desserts",
  },
  {
    name: "Classic New York Cheesecake",
    description: "Rich and creamy baked cheesecake with a buttery graham cracker crust, topped with fresh strawberry compote.",
    price: 229,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    categoryName: "Desserts",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data (optional, but good for clean seed)
    await Category.deleteMany({});
    await Menu.deleteMany({});
    await mongoose.connection.db.collection("orders").deleteMany({});
    await mongoose.connection.db.collection("bookings").deleteMany({});
    await mongoose.connection.db.collection("carts").deleteMany({});
    console.log("Cleared existing categories, menu items, orders, bookings, and carts.");

    // Seed Categories
    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);

    // Create mapping of category name to id
    const categoryMap = {};
    seededCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Map category ids to menu items
    const menuItemsToSeed = menuItemsData.map((item) => {
      const catId = categoryMap[item.categoryName];
      if (!catId) {
        throw new Error(`Category ${item.categoryName} not found during mapping.`);
      }
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: catId,
        isAvailable: true,
      };
    });

    // Seed Menu Items
    const seededMenuItems = await Menu.insertMany(menuItemsToSeed);
    console.log(`Seeded ${seededMenuItems.length} menu items successfully.`);

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDB();
