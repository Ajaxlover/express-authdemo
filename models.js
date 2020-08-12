const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/express-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// 定义用户模型
const UserSchema = new mongoose.Schema({
  // 1.设置unique为true  用户名不能重复
  // 2.对密码加密  加密强度为10

  username: { type: String,unique:true},
  password: { 
    type: String,
    set(val) {
      return require("bcryptjs").hashSync(val,10)
    } 
},
});

const User = mongoose.model(
  "User",
  UserSchema
);


// 删除users集合
// User.db.dropCollection("users");


module.exports = {
  User
}
