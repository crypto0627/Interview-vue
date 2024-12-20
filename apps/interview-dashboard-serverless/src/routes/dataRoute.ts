import { Hono } from 'hono'
import * as dataController from '../controllers/dataController'

const app = new Hono()

app.post('/api/init', dataController.initData)
app.get('/api/data', dataController.getData)
app.post('/api/data', dataController.postData)
app.put('/api/data/:id', dataController.putData)
app.delete('/api/data/:id', dataController.deleteData)

export default app
