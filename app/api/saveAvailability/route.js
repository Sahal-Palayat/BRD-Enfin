import redis from "../../../lib/redis";
const dateNames = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function getDateRange(startDate, endDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const dayIndex = currentDate.getDay();
    dates.push({
      date: currentDate.toISOString().split("T")[0], // Format YYYY-MM-DD
      day: dateNames[dayIndex], // Get the corresponding day name
    });
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }
  return dates;
}

export async function POST(req) {
  try {
    const { userId, startDate, endDate } = await req.json();

    const data = JSON.parse(await redis.get("participantAvailability"));
    const availableDates = getDateRange(startDate, endDate);

    const finalResult = availableDates
      .map(({ date, day }) => {
        const usersAvailability = Object.entries(data)
          .filter(([key]) => userId.includes(key))
          .map(([key, value]) => ({
            userId: key,
            slots: value[day] || [],
          }))
          .filter((user) => user.slots.length > 0);

        return usersAvailability.length > 0
          ? { date, day, users: usersAvailability }
          : null;
      })
      .filter((entry) => entry !== null); // Remove empty dates

    const last = finalResult.map((item) => {
      return {
        date: item.date,
        slot: item.users.flatMap((user) => user.slots),
      };
    });

    console.log(last[0]);

    return new Response(
      JSON.stringify({ message: "Saved successfully", data: last }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to save" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Example query param

    const users = JSON.parse(await redis.get("participantAvailability"));
   
    return new Response(JSON.stringify(users[userId]), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
