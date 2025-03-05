import AvailabilityForm from "@/components/AvailabilityForm";



async function getAvailability(userId) {
  try {
    const response = await fetch("http://localhost:3000/api/saveAvailability?userId="+userId, {
      cache: "no-store", // Ensures fresh data on every request
    });
    const availability = await response.json();
    return availability;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}


export default async function AvailabilityPage({ params }) {
  const { user_id } = params; 
  const avail = await getAvailability(user_id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Set Your Weekly Availability</h1>
      <AvailabilityForm userId={user_id} initialData={avail} />
    </div>
  );
}
