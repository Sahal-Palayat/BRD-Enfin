import redis from '../../../lib/redis'


export async function GET(req){
    try {
      const users = JSON.parse( await redis.get('participants'))
      return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
      console.log(error);
    }
  }