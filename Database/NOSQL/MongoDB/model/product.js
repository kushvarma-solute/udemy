const mongodb=require('mongodb');
const getDb= require('../util/database').getDb;
class Product{
   constructor(title,price,description,imageurl,id,userId)
   {
      this.title=title;
      this.price=price;
      this.description=description;
      this.imageurl=imageurl;
      this._id = id ? new mongodb.ObjectId(id) : null;
      this.userId = userId;
   }
   save(){
      const db = getDb();
      let dbop;
      if(this._id)
      {
        //update the product
        dbop=db.collection('products').updateOne({_id: this._id},{$set:this});
      }
      else
      {
        dbop =db.collection("products")
        .insertOne(this);
      }
     return dbop
      .then((result) => {
        console.log(result);
      }).catch((err) => {
          console.log(err);
      });
    }
    
    static fetchAll(){
      const db =getDb();
      return db.collection('products')
      .find()//it will return an cursor
      .toArray()//return promise
      .then((products) => {
        console.log(products);
        return products;
      }).catch((err) => {
        console.log(err);
      });
    }

    //used for detail button:
    static findById(proId){
      const db =getDb();
      return db.collection('products')
      .find({_id : new mongodb.ObjectId(proId)})//it will return an cursor
      .next()
      .then((products) => {
        console.log(products);
        return products;
      }).catch((err) => {
        console.log(err);
      });
    }

    static deleteById(proId){
      const db = getDb();
      return db.collection('products')
      .deleteOne({_id: new mongodb.ObjectId(proId)})
      .then((result) => {
        console.log("product deleted");
      }).catch((err) => {
        console.log(err);
      });
    }
}

module.exports = Product;
 


