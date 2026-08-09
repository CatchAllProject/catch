const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) =>{
    const {email, password} = req.body;

    console.log(email, password);

    res.json({message: 'Recebido'});
})

app.listen(3000, ()=> {
    console.log('Backend is running');
})