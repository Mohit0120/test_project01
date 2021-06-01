const mongoose=require('mongoose');
const plm =require('passport-local-mongoose');
mongoose.connect('mongodb://localhost/prctone', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema=mongoose.Schema({
  name:String,
  username:String,
  password:String,
  email:String,
  profileimg:{
    type:String,
    default:'../images/upload/default.jpg'
  },
  products:[{type:mongoose.Schema.Types.ObjectId,ref:'product'}],
  last_login_date: {
    type: Date,
    default: Date.now
}
});

userSchema.plugin(plm);
module.exports=mongoose.model('user',userSchema);

mongoose.model('user' ,userSchema);