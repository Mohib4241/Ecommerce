import express from 'express'
import config from '../config/index'
import v1 from '../routes/index'
import cors from 'cors'

console.log(config);

const app = express()
const port =  config.PORT

app.use(express.json())


app.use(cors());

app.use('/api/v1',v1)


app.listen(port , () => {
    console.log(`http://localhost:${port}`);
})
