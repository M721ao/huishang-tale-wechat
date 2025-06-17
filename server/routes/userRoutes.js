const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// 微信登录接口
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: '缺少微信登录code' });
    }
    
    // 调用微信API获取openid
    const wxApiUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WX_APP_ID}&secret=${process.env.WX_APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    
    const wxResponse = await axios.get(wxApiUrl);
    const { openid, session_key, errcode, errmsg } = wxResponse.data;
    
    if (errcode) {
      return res.status(400).json({ message: `微信API错误: ${errmsg}` });
    }
    
    // 查找或创建用户
    let user = await User.findOne({ openid });
    
    if (!user) {
      // 创建新用户
      user = new User({ 
        openid,
        isNewUser: true
      });
      await user.save();
    } else {
      // 如果不是首次登录，更新isNewUser状态
      if (user.isNewUser) {
        user.isNewUser = false;
        await user.save();
      }
    }
    
    // 返回用户信息和自定义登录态
    res.json({
      success: true,
      userId: user._id,
      isNewUser: user.isNewUser
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});


module.exports = router;
