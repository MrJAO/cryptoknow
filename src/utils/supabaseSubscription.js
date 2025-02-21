import { supabase } from "../supabaseClient"; // Adjust path if needed

export const subscribeToAirdrops = (setAirdrops) => {
  // Fetch initial data
  const fetchAirdrops = async () => {
    const { data, error } = await supabase.from("Available Airdrops").select("*");
    if (error) console.error("Error fetching airdrops:", error);
    else setAirdrops(data);
  };

  fetchAirdrops();

  // Subscribe to real-time updates
  const subscription = supabase
    .from("Available Airdrops")
    .on("INSERT", (payload) => {
      console.log("New airdrop received:", payload);
      setAirdrops((prev) => [...prev, payload.new]);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
