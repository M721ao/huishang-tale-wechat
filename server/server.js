const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入路由
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

// 初始化Express应用
const app = express();

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 路由
app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('后端服务运行中');
});

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
