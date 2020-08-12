// 引入模型
const { User } = require("./models");
const express = require("express");

const jwt = require("jsonwebtoken");

const SECRET = "hdajkhfkhfkjdhk";
let app = express();

// 使用中间件解析出req.body
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// 定义auth中间件  中间本质其实还是回调函数
const auth  =  async (req,res,next)=>{
  const raw = String(req.headers.authorization.split(' ').pop());
  const { id } = jwt.verify(raw,SECRET);
  const user = await User.findById(id);
  next();
}



app.get("/", async (req, res) => {
  res.send("ok");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//个人信息
app.get("/profile",auth, async (req, res) => {
  // //获取请求token 封装为auth中间件 
  // const raw = req.headers.authorization.split(' ').pop();
  // // 验证token
  // const { id } = jwt.verify(raw,SECRET);
  // const user = await User.findById(id)
  res.send(user);
});

//注册
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.create({
    username,
    password
  });
  res.send(user);
});

//登录
app.post("/login", async (req, res) => {
  // console.log(req.body.username)
  //根据username查找
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    //用户不存在
    return res.status(422).send({
      message: "用户名不存在",
    });
  }
  //用户存在  则比较密码
  const isPasswordValid = require("bcryptjs").compareSync(
    req.body.password,
    user.password
  );

  console.log(isPasswordValid)

  if (!isPasswordValid) {
    //密码不匹配
    return res.status(422).send({
      message: "密码错误",
    });
  }

  // 密码正确 生成token 并返回当前用户
  //签名
  const token = jwt.sign(
    {
      id: String(user._id),
    },
    SECRET
  );
  res.send({
    user,
    token
  });
});

app.listen(3000, () => {
  console.log("服务开启成功");
});
