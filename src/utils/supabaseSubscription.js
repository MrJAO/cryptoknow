import { supabase } from "../supabaseClient"; // Adjust path if needed

export const subscribeToAirdrops = (setAirdrops) => {
  // Fetch initial data excluding "id"
  const fetchAirdrops = async () => {
    const { data, error } = await supabase
      .from("available_airdrops")
      .select("*, id!hidden"); // ✅ Excludes id

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
      { event: "INSERT", schema: "public", table: "available_airdrops" },
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
