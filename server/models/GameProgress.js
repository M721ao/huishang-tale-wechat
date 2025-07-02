const mongoose = require("mongoose");

const GameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentChapter: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

module.exports = mongoose.model("GameProgress", GameProgressSchema);
