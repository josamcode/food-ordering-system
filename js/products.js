/* =========================================================
   Foodie - Product Catalogue
   This file is the single source of truth for menu items.
   ========================================================= */

const PRODUCTS = [
  /* ---------- Burgers ---------- */
  {
    id: 1,
    name: "Smokehouse Beef Burger",
    category: "Burgers",
    price: 95,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Char-grilled beef patty, smoked cheddar, crisp lettuce and house aioli on a brioche bun.",
    rating: 4.8,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Crispy Chicken Burger",
    category: "Burgers",
    price: 85,
    image: "https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&w=800&q=80",
    description: "Buttermilk-fried chicken thigh, pickles and a slow-burn chipotle sauce.",
    rating: 4.7
  },
  {
    id: 3,
    name: "Double Cheddar Stack",
    category: "Burgers",
    price: 120,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
    description: "Two seared beef patties, double cheddar, caramelised onion and brioche.",
    rating: 4.9,
    badge: "Hot"
  },
  {
    id: 4,
    name: "Garden Veggie Burger",
    category: "Burgers",
    price: 75,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
    description: "House-made chickpea patty, roasted peppers, tahini and rocket.",
    rating: 4.5
  },

  /* ---------- Pizza ---------- */
  {
    id: 5,
    name: "Classic Margherita",
    category: "Pizza",
    price: 110,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80",
    description: "San Marzano tomato, torn fior di latte and fresh basil on a charred sourdough base.",
    rating: 4.8
  },
  {
    id: 6,
    name: "Pepperoni Inferno",
    category: "Pizza",
    price: 135,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    description: "Layers of cured pepperoni, mozzarella, oregano and a chilli-honey drizzle.",
    rating: 4.9,
    badge: "Bestseller"
  },
  {
    id: 7,
    name: "BBQ Chicken Pizza",
    category: "Pizza",
    price: 145,
    image: "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80",
    description: "Pulled BBQ chicken, smoked gouda, red onion and coriander.",
    rating: 4.7
  },
  {
    id: 8,
    name: "Quattro Formaggi",
    category: "Pizza",
    price: 140,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description: "Mozzarella, gorgonzola, parmesan and aged cheddar with cracked pepper.",
    rating: 4.6
  },

  /* ---------- Pasta ---------- */
  {
    id: 9,
    name: "Spaghetti Bolognese",
    category: "Pasta",
    price: 95,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description: "Slow-braised beef ragù tossed with bronze-cut spaghetti and parmigiano.",
    rating: 4.7
  },
  {
    id: 10,
    name: "Fettuccine Alfredo",
    category: "Pasta",
    price: 105,
    image: "https://images.unsplash.com/photo-1633436374961-09b92742047b?auto=format&fit=crop&w=800&q=80",
    description: "Silky parmesan cream, butter and fresh fettuccine — finished with cracked pepper.",
    rating: 4.6
  },
  {
    id: 11,
    name: "Penne Arrabbiata",
    category: "Pasta",
    price: 90,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
    description: "Bright tomato, garlic, chilli and basil — simple and bracing.",
    rating: 4.5,
    badge: "Spicy"
  },

  /* ---------- Drinks ---------- */
  {
    id: 12,
    name: "House Lemonade",
    category: "Drinks",
    price: 30,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80",
    description: "Hand-pressed lemons with mint and a hint of cane sugar over crushed ice.",
    rating: 4.8
  },
  {
    id: 13,
    name: "Cold Brew Coffee",
    category: "Drinks",
    price: 40,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    description: "Slow-extracted single-origin beans served black over ice.",
    rating: 4.7
  },
  {
    id: 14,
    name: "Mango Lassi",
    category: "Drinks",
    price: 45,
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&w=800&q=80",
    description: "Ripe alphonso mango blended with yogurt and a touch of cardamom.",
    rating: 4.9,
    badge: "New"
  },

  /* ---------- Desserts ---------- */
  {
    id: 15,
    name: "Molten Chocolate Brownie",
    category: "Desserts",
    price: 50,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "Dark chocolate brownie, gooey centre, served warm with vanilla ice cream.",
    rating: 4.9,
    badge: "Bestseller"
  },
  {
    id: 16,
    name: "New York Cheesecake",
    category: "Desserts",
    price: 60,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    description: "Dense baked cheesecake on a buttery biscuit base with seasonal berry compote.",
    rating: 4.8
  },
  {
    id: 17,
    name: "Classic Tiramisu",
    category: "Desserts",
    price: 65,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    description: "Espresso-soaked savoiardi layered with mascarpone cream and cocoa.",
    rating: 4.7
  }
];

/* Used for the category filter */
const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Drinks", "Desserts"];

/* Currency + delivery config */
const CURRENCY = "EGP";
const STANDARD_DELIVERY_FEE = 20;
const FREE_DELIVERY_THRESHOLD = 250;
/* Kept as an alias for any older references */
const DELIVERY_FEE = STANDARD_DELIVERY_FEE;
