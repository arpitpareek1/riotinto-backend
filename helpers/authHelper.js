
function generateOTP() {
  // Implement your OTP generation logic (e.g., random 6-digit number)
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const productsData = [
  {
    imageSource: 'https://st2.depositphotos.com/1071250/5607/i/950/depositphotos_56070347-stock-photo-steel-pipe.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/c1bd5a3f94c86a1ffd054fe807dab065.png',
    price: '9500',
    title: 'Steel',
    dailyIncome: 50,
    validity: 20,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://st2.depositphotos.com/1000128/6284/i/950/depositphotos_62849373-stock-photo-gold-ingots.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/af58a72d4a2a1cfc2eab779edacb6cad.png',
    price: '15000',
    title: 'Gold',
    dailyIncome: 100,
    validity: 15,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://static6.depositphotos.com/1000765/542/i/950/depositphotos_5422515-stock-photo-diamond.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/13f6c68f1e589d6057159f311df08ee0.png',
    price: '21000',
    title: 'Diamond',
    dailyIncome: 75,
    validity: 30,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://static9.depositphotos.com/1011268/1193/i/950/depositphotos_11930340-stock-photo-coal-stack.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/25986e69c288fbad250182daaa4c96ba.png',
    price: '5000',
    title: 'Coal',
    dailyIncome: 30,
    validity: 10,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://static7.depositphotos.com/1002277/730/i/950/depositphotos_7306806-stock-photo-platinum-ingots.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/a8508bc95a3c91de574cd7bfd3642c76.png',
    price: '4000',
    title: 'Platinum',
    dailyIncome: 40,
    validity: 25,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://st.depositphotos.com/1187563/4173/i/950/depositphotos_41738915-stock-photo-stack-of-bank-silver-bars.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/abe6b99bd33cc5600a8d4f48fb6e2350.png',
    price: '9000',
    title: 'Silver Bars',
    dailyIncome: 60,
    validity: 18,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://static3.depositphotos.com/1003914/193/i/950/depositphotos_1930601-stock-photo-blue-ball.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/abe6b99bd33cc5600a8d4f48fb6e2350.png',
    price: '11000',
    title: 'Blue Faceted Crystal',
    dailyIncome: 80,
    validity: 22,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://st3.depositphotos.com/10634550/13841/i/1600/depositphotos_138419038-stock-photo-granite-kitchen-countertops.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/abe6b99bd33cc5600a8d4f48fb6e2350.png',
    price: '8600',
    title: 'Granite',
    dailyIncome: 55,
    validity: 12,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
  {
    imageSource: 'https://static7.depositphotos.com/1066342/776/i/950/depositphotos_7767169-stock-photo-impassioned-gemology.jpg',
    link: 'https://www.trumpfe.com/uploads/20231231/abe6b99bd33cc5600a8d4f48fb6e2350.png',
    price: '800',
    title: 'Colour Stones',
    dailyIncome: 25,
    validity: 28,
    purchaseLimit: 2,
    desc:"this is dummy text to show desc"
  },
];

const newsData = [
  {
    title: "News Title 1",
    date: "19/10/23 13:30:19",
    description: "Description for News Title 1.",
    imageSource: "https://www.trumpfe.com/uploads/20231019/22b42e965adfef7027580f307cfb2d6e.jpg",
    category: "Announcement - Any random text here.",
  },
  {
    title: "News Title 2",
    date: "19/10/23 13:30:19",
    description: "Description for News Title 2.",
    imageSource: "https://www.trumpfe.com/uploads/20231001/7838d553d56635152aab23391e66e158.jpg",
    category: "Announcement - Any random text here.",
  },
  {
    title: "News Title 3",
    date: "19/10/23 13:30:19",
    description: "Description for News Title 3.",
    imageSource: "https://www.trumpfe.com/uploads/20231001/b99ac897e81079cb2e5d7ef25f0306fc.jpg",
    category: "Announcement - Any random text here.",
  },
  {
    title: "News Title 4",
    date: "19/10/23 13:30:19",
    description: "Description for News Title 4.",
    imageSource: "https://www.trumpfe.com/uploads/20231019/22b42e965adfef7027580f307cfb2d6e.jpg",
    category: "Announcement - Any random text here.",
  },
];

module.exports = { generateOTP, productsData, newsData };
