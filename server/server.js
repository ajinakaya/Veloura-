const express = require('express');
const dotenv = require('dotenv').config({ path: './config/.env' });
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require("path");


// database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database not connected', err))
    
   
// middleware
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), require('./controller/stripeController').paymentWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(
    cors({
        credentials:true,
        origin:'https://localhost:5173'
    })

)

// routes
app.use('/', require('./routes/authroutes'));
app.use('/users', require('./routes/userroutes'));
app.use('/jewelry', require('./routes/jewelryroutes'));
app.use('/category', require('./routes/categoryroutes'));
app.use('/returnpolicy', require('./routes/returnpolicyroutes'));
app.use('/cart', require('./routes/cartroutes'));
app.use('/wishlist', require('./routes/wishlistroutes'));
app.use('/shippingrate', require('./routes/shippingroutes'));
app.use('/order', require('./routes/orderroutes'));
app.use('/notifications', require('./routes/notificationroutes'));
app.use('/sizeguide', require('./routes/sizeguideroutes'));
app.use('/stripe', require('./routes/striperoutes'));
app.use('/activitylog', require('./routes/activitylogroute'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const https = require("https");
const fs = require("fs");


if (require.main === module && process.env.NODE_ENV !== "test") {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, "./certificate/localhost.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./certificate/localhost.crt")),
  };

  https.createServer(options, app).listen(3001, "0.0.0.0", () => {
    console.log("HTTPS backend running on https://0.0.0.0:3001");
  });
}


module.exports = app;
