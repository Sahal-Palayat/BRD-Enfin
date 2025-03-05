import Redis from "ioredis";

// // Connect to Redis
// const redis = new Redis({
//   host: "127.0.0.1",  // Change to your Redis server host
//   port: 6379,         // Default Redis port
//   password: process.env.NEXT_PUBLIC_PASSWORD,       // Add password if required
// });

import { createClient } from 'redis';


export const redis = createClient({
    password: process.env.NEXT_PUBLIC_PASSWORD,
    socket: {
        host: process.env.NEXT_PUBLIC_HOST,
        port: Number(process.env.NEXT_PUBLIC_PORT) 
    }
});

redis.connect()    
redis.on('connect', () => console.log('Connected to Redis'));   

redis.on('error', (err) => console.error(`Error connecting to Redis: ${err}`));


export default redis;

// const schedules = {
//   1: { 
//     "28/10/2024": [
//       { "start": "09:30", "end": "10:30" }, 
//       { "start": "15:00", "end": "16:30" }
//     ] 
//   },
//   2: { 
//     "28/10/2024": [{ "start": "13:00", "end": "13:30" }], 
//     "29/10/2024": [{ "start": "09:00", "end": "10:30" }] 
//   }
// };
// (async()=>{
//  console.log('workingggggg')
//  await redis.set('schedules',JSON.stringify(schedules))
// })()      