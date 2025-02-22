import { supabase } from "../supabaseClient"; // Adjust path if needed

export const subscribeToAirdrops = (setAirdrops) => {
  // Fetch initial data (exclude "id" explicitly)
  const fetchAirdrops = async () => {
    const { data, error } = await supabase
      .from("available_airdrops")
      .select("project_name, task_link, chain, airdrop_type, device_needed, status"); // ✅ Excludes "id"

    if (error) {
      console.error("Error fetching airdrops:", error);
    } else {
      setAirdrops(data);
    }
  };

  fetchAirdrops();

  // Subscribe to real-time updates
  const channel = supabase
  .channel("available_airdrops")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "available_airdrops" },
    (payload) => {
      console.log("Airdrop update received:", payload);
      setAirdrops((prev) => {
        if (payload.eventType === "INSERT") {
          return [...prev, payload.new]; // Add new item
        } else if (payload.eventType === "UPDATE") {
          return prev.map((item) =>
            item.project_name === payload.new.project_name ? payload.new : item
          ); // Update item
        } else if (payload.eventType === "DELETE") {
          return prev.filter((item) => item.project_name !== payload.old.project_name);
        }
        return prev;
      });
    }
  )
  .subscribe();


  return () => {
    supabase.removeChannel(channel); // Cleanup on unmount
  };
};
