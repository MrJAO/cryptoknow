import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AvailableAirdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedAirdropType, setSelectedAirdropType] = useState('');
  const [selectedDeviceNeeded, setSelectedDeviceNeeded] = useState('');

  // Fetch available airdrops whenever the filter criteria change
  useEffect(() => {
    const fetchAirdrops = async () => {
      const { data, error } = await supabase
        .from('available_airdrops')
        .select('*')
        .eq('chain', selectedChain)
        .eq('airdrop_type', selectedAirdropType)
        .eq('device_needed', selectedDeviceNeeded);

      if (error) {
        console.error('Error fetching airdrops:', error);
      } else {
        setAirdrops(data);
      }
    };

    // Only fetch if all filters have been set (or adjust as needed)
    if (selectedChain && selectedAirdropType && selectedDeviceNeeded) {
      fetchAirdrops();
    }
  }, [selectedChain, selectedAirdropType, selectedDeviceNeeded]);

  return (
    <div>
      {/* Render your filter inputs here */}
      {/* For example: */}
      <select onChange={(e) => setSelectedChain(e.target.value)}>
        <option value="">Select Chain</option>
        {/* Options go here */}
      </select>
      <select onChange={(e) => setSelectedAirdropType(e.target.value)}>
        <option value="">Select Airdrop Type</option>
        {/* Options go here */}
      </select>
      <select onChange={(e) => setSelectedDeviceNeeded(e.target.value)}>
        <option value="">Select Device Needed</option>
        {/* Options go here */}
      </select>

      {/* Render the list of airdrops */}
      {airdrops.map((airdrop) => (
        <div key={airdrop.id}>
          <h3>{airdrop.project_name}</h3>
          <p>{airdrop.task_link}</p>
          {/* Other details */}
        </div>
      ))}
    </div>
  );
};

export default AvailableAirdrops;
