import express from 'express'
import config from '../config/index'
import v1 from '../routes/index'


const app = express()
const port =  config.PORT

app.use(express.json())

app.use('/api/v1',v1)


app.listen(port , () => {
    console.log(`http://localhost:${port}`);
})
