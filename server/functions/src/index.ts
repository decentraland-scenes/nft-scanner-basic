const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

exports.app = functions.https.onRequest(app)

var admin = require('firebase-admin')
var serviceAccount = require('../permissions.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dcl-guestbook0.firebaseio.com',
})

app.get('/hello-world', (req: any, res: any) => {
  return res.status(200).send('Hello World!')
})

const db = admin.firestore()

////////////////////////////////////////////////////////////////////////////
/////   SIGNATURES   /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

let signatures = db.collection('Signatures')

app.get('/get-signatures', async (req: any, res: any) => {
  try {
    let response: any = []
    await signatures.get().then((queryResult: { docs: any }) => {
      for (let doc of queryResult.docs) {
        response.push(doc.data())
      }
    })
    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

app.post('/add-signature', async (req: any, res: any) => {
  let newSignature = req.body
  try {
    await signatures
      .doc('/'+newSignature.id+'/')
      .create({
        id: newSignature.id,
        name: newSignature.name,
        time: new Date().toString(),
      })

    return res.status(200).send('Signed book!')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

app.post('/update-signature', async (req: any, res: any) => {
  let newSignature = req.body
  try {
    await signatures
      .doc('/'+newSignature.id+'/')
      .update({
        time: new Date().toString()
      })

    return res.status(200).send('Signature is updated successfully!')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

////////////////////////////////////////////////////////////////////////////
/////   VISITORS   /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

let visitors = db.collection('Visitors')

app.get('/get-visitors', async (req: any, res: any) => {
  try {
    let response: any = []
    await visitors.get().then((queryResult: { docs: any }) => {
      for (let doc of queryResult.docs) {
        response.push(doc.data())
      }
    })
    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

app.post('/add-visitor', async (req: any, res: any) => {
  let newVisitor = req.body
  try {
    await visitors
      .doc('/' + newVisitor.id + '/')
      .update({
        time: new Date().toString(),
      })

    return res.status(200).send('Visitor added!')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})