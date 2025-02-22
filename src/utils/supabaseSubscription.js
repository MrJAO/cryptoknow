import { supabase } from "../supabaseClient"; // Adjust path if needed

export const subscribeToAirdrops = (setAirdrops) => {
  // Fetch initial data
  const fetchAirdrops = async () => {
    const { data, error } = await supabase.from("available_airdrops").select("*"); // ✅ Fixed table name
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
      { event: "INSERT", schema: "public", table: "available_airdrops" }, // ✅ Fixed table name
      (payload) => {
        console.log("New airdrop received:", payload);
        setAirdrops((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel); // Cleanup on unmount
  };
};
