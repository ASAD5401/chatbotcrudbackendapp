
// const { application } = require('express')
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express()
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-with, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
  });

app.use(express.json())
mongoose.connect('mongodb+srv://saadkhan:saadkhan@cluster0.fquu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(()=>console.log("connection succesfull")).catch((error)=>console.log(error))
const student=mongoose.model('Students',{
    name:{
        type:String,
        required:true
    },
    rollno:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
})


app.post('/student', async(req,res)=>{
    const {name,email,phone,rollno,address}=req.body
    console.log(name,email,phone,rollno,address)
    if(!name || !email || !phone || !rollno || !address){
        return (res.status(500).send("plz fill all fields")
        ) //422 is for unprocessible entity
    }else{
        const userExist= await student.findOne({rollno:rollno}) 
        if(userExist){
            console.log("exsists")

            return(res.status(400).send("student already exsists"))

        }else{

            const table=new student({name,email,phone,rollno,address})
            table.save().then(()=>{console.log("student registered successfully");res.status(200).send('OK') 
        }).catch((error)=>{console.log(error)})
        }
    }
})


app.get('/students',async (req,res)=>{
    const documents= await student.find()
    console.log(documents)
    res.send(documents)
})

app.get('/student/:id',async (req,res)=>{
    const student_rollno=req.params.id
    const document= await student.findOne({_id:student_rollno})
    if(document){
        res.send(document)
    }else{
        res.send("No student with this id exists")
    }
    console.log(document)
})



app.delete('/student/:id',async(req,res)=>{
    const student_rollno=req.params.id
    student.findByIdAndRemove(student_rollno, (err, data) => {
        if (!err) {
          res.send("Student successfully deleted")
        } else {
          res.status(500).send("No student with this id exists")
        }
      })
})

app.put('/student/:id',(req,res)=>{
    const student_rollno=req.params.id
    let updateObj={}
    if(req.body.name){
        updateObj.name=req.body.name
    }
    if(req.body.email){
        updateObj.email=req.body.email
    }
    if(req.body.phone){
        updateObj.phone=req.body.phone
    }
    if(req.body.address){
        updateObj.address=req.body.address
    }
    if(req.body.rollno){
        updateObj.rollno=req.body.rollno
    }
    console.log(updateObj)
    student.findByIdAndUpdate(student_rollno,updateObj,{new:true},(err,data)=>{
        if (!err) {
            res.status(200).send("Student successfully updated")
          } else {
            res.status(500).send("No student with this id exists")
          }
    })

})
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server is running on ${PORT}`))