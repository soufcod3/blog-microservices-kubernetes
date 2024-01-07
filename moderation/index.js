const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const handleEvent = async (type, data) => {
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'

      await axios.post('http://event-bus-srv:4005/events', {
          type: 'CommentModerated',
          data: {
              id: data.id,
              postId: data.postId,
              status,
              content: data.content
          }
      })
  } 
} 

app.post("/events", async (req, res) => {

    const { type, data } = req.body

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved'

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
    }
    res.send({})
});

app.listen(4003, async() => {
  console.log("listening on 4003");

  const res = await axios.get('http://localhost:4005/events')

  for (const event of res.data) {
      console.log('processing event : ', event.type)

      handleEvent(event.type, event.data)
  }
});