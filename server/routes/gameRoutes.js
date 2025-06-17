const express = require('express');
const router = express.Router();
const GameProgress = require('../models/GameProgress');
const User = require('../models/User');

// 获取游戏进度
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: '请检查用户ID' });
    }
    
    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 查找用户的游戏进度
    let progress = await GameProgress.findOne({ userId });
    
    // 如果没有找到进度记录，创建一个新的
    if (!progress) {
      progress = new GameProgress({ userId });
      await progress.save();
    }
    
    res.json({
      success: true,
      progress: {
        currentChapter: progress.currentChapter,
      }
    });
    
  } catch (error) {
    console.error('获取游戏进度错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 保存游戏进度
router.post('/progress', async (req, res) => {
  try {
    const { 
      userId, 
      currentChapter
    } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: '请检查用户ID' });
    }
    
    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 查找或创建游戏进度记录
    let progress = await GameProgress.findOne({ userId });
    
    if (!progress) {
      progress = new GameProgress({ userId });
    }
    
    // 更新游戏进度
    if (currentChapter) progress.currentChapter = currentChapter;
    
    progress.updatedAt = Date.now();
    await progress.save();
    
    res.json({
      success: true,
      message: '游戏进度保存成功'
    });
    
  } catch (error) {
    console.error('保存游戏进度错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 重置游戏进度
router.post('/reset', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: '缺少用户ID' });
    }
    
    // 删除游戏进度
    await GameProgress.findOneAndDelete({ userId });
    
    // 创建新的初始进度
    const newProgress = new GameProgress({ userId });
    await newProgress.save();
    
    res.json({
      success: true,
      message: '游戏进度已重置',
      progress: {
        currentChapter: newProgress.currentChapter,
      }
    });
    
  } catch (error) {
    console.error('重置游戏进度错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
