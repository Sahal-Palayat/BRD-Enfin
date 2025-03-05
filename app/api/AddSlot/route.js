import redis from "../../../lib/redis";



export async function POST(req) {
    try {
      const body = await req.json()
     
      
      const data = JSON.parse(await redis.get ('participantAvailability'))
      console.log(data[body.userId])

      data[body.userId]= body.availability
      console.log(data[body.userId])
      await redis.set('participantAvailability',JSON.stringify(data))
      
      return new Response(JSON.stringify(body ,{status:200}))
     
    } catch (error) {
      console.log(error);
      
    }
  }
