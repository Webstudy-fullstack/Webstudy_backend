var express = require('express');
const User = require('../models/user');
var router = express.Router();
var statusCode = require('../modules/statusCode')
var resMessage = require('../modules/responseMessage')
var util = require('../modules/util');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async(req,res)=>{
  const { id, name, password, email } = req.body;
  if(!id || !name || !password || !email){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }

  //사용중인 아이디가 있는지 확인 코드

  console.log(Boolean(User.checkUser("user")))
  if(await User.checkUser("user")){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
    return;
  }
  console.log(">>> 2")

  const salt = 'dfw23EFVR3fefnd68FW3r4343';
  //User.push({id, name, password, email});
  const idx = await User.signup(id, name, password, salt, email);
  if (idx === -1){
    return res.status(statusCode.DB_ERROR)
    .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
  }
  res.send(statusCode.OK)
  .send(util.success(statusCode.OK, resMessage.CREATED_USER, {userId : idx}));
})

router.post('/signin', async(req,res)=>{
  const {id, password} = req.body;
  if(!id || !password){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }

  if(User.signin(id, password)){
    res.status(statusCode.BAD_REQUEST)
    .send(util.fail(statusCode.BAD_REQUEST,resMessage.MISS_MATCH_PW));
    return; //나중에 로그인페이지 이동 예정
  }
  res.send(statusCode.OK)
  .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS));
})

module.exports = router;
