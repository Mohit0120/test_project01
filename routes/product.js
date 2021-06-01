const mongoose=require('mongoose');


const productschema=mongoose.Schema({
  price:String,
  name:String,
  description:String,
  userid:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
  productimage:{
    type:String,
    required:true
  }
});

module.exports=mongoose.model('product',productschema);

mongoose.model('product' ,productschema);