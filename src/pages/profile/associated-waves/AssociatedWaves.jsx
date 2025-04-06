import React from "react";
import WaveCard from "../../../components/WaveCard/WaveCard";
import { Loader } from "../../../components/Loader/Loader";
import { message } from "antd";
import { approveOrRejectWave } from "../../../services/waves";
const heading = "text-xl font-bold m-0 p-0 mb-3";
function AssociatedWaves({ waves, getWaves }) {
  const [loading, setLoading] = React.useState(false);

  const updateWaveStatus = async (waveId, status) => {
    setLoading(true);
    const res = await approveOrRejectWave(waveId, status);
    if (res.success) {
      message.success("Wave status updated successfully");
      getWaves(); // Refresh the waves after status update
    } else {
      message.error("Error updating wave status");
      console.error("Error updating wave status:", res.error);
    }
    setLoading(false);
  };
  return (
    <div>
      <Loader loading={loading} />
      <h1 className={heading}>Associated Waves</h1>
      {waves.length === 0 ? (
        <p>Your charity does not have any associated waves.</p>
      ) : (
        <ul
          className="list-disc pl-5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
            gap: "20px",
          }}
        >
          {waves.map((wave) => (
            <WaveCard
              key={wave._id}
              waveInfo={wave}
              allowEdit={false}
              allowDelete={false}
              isUsersOwn={false}
              updateWaveStatus={updateWaveStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssociatedWaves;
