import mongoose from 'mongoose';


const m1Schema = new mongoose.Schema({
   user :
   {
         type : String,
         required : true
   }

})
export const model = mongoose.model('model',m1Schema);