require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Product = require("./models/Product");

const PRODUCTS = [
    {
        name: "Ногоон Цай Шам",
        price: 45000,
        description: "Жинхэнэ Японы ногоон цай. Антиоксидантаар баялаг, эрүүл мэндэд тустай. Органик аргаар тариалсан.",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
    },
    {
        name: "Хавтгай Дэвтэр Set",
        price: 32000,
        description: "Өндөр чанарын A5 хэмжээний хавтгай дэвтэр. 5 өнгийн бал пентэй иркэм. Оюутан, оффисын ажилтанд тохиромжтой.",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
    },
    {
        name: "Ceramic Аяга",
        price: 28000,
        description: "Гар урлалын керамик аяга. Өнгө тогтвортой, дулаан хадгалах чанар сайтай. 350ml багтаамжтай.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
    },
    {
        name: "Аромат Лаа",
        price: 55000,
        description: "Байгалийн лавандр үнэрт гар хийцийн лаа. 40 цагийн турш шатна. Унтлагын өрөөнд тохиромжтой.",
        image: "https://images.unsplash.com/photo-1602607144090-ef1d3c47c0af?w=400&q=80",
    },
    {
        name: "Хөвөн Хүрэм",
        price: 120000,
        description: "100% органик хөвөн материалаар хийсэн тав тухтай хүрэм. Бүх улиралд тохиромжтой. Унисекс загвар.",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80",
    },
    {
        name: "Дэлхийн Газрын зураг",
        price: 75000,
        description: "Хананы чимэглэлийн том хэмжээний дэлхийн газрын зураг. 100x60cm. Гэр болон оффист тохиромжтой.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80",
    },
    {
        name: "Модон Тавиур",
        price: 95000,
        description: "Байгалийн модоор хийсэн гэр зохион байгуулалтын тавиур. 3 давхар. Хүрэн өнгийн будагтай.",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    },
    {
        name: "RGB Гэрэл",
        price: 65000,
        description: "Ухаалаг RGB LED гэрэл. Утасны апп-аар удирддаг. 16 сая өнгийн тохируулга. Тасалгааны чимэглэлд тохиромжтой.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nomad-shop");
        console.log("✅ MongoDB холбогдлоо");

        // Хуучин өгөгдөл устгах
        await Admin.deleteMany({});
        await Product.deleteMany({});
        console.log("🗑️  Хуучин өгөгдөл устгагдлаа");

        // Admin үүсгэх
        const admin = await Admin.create({
            username: process.env.ADMIN_USERNAME || "admin",
            password: process.env.ADMIN_PASSWORD || "admin123",
        });
        console.log(`👤 Admin үүслээ: ${admin.username}`);

        // Бүтээгдэхүүн нэмэх
        const products = await Product.insertMany(PRODUCTS);
        console.log(`🛍️  ${products.length} бүтээгдэхүүн нэмэгдлээ`);

        console.log("\n✅ Seed амжилттай дуусгалаа!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Admin нэр:    ${process.env.ADMIN_USERNAME || "admin"}`);
        console.log(`Admin нууц үг: ${process.env.ADMIN_PASSWORD || "admin123"}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed алдаа:", err.message);
        process.exit(1);
    }
};

seed();