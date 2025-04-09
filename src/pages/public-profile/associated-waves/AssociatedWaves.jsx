import React from "react";
import WaveCard from "../../../components/WaveCard/WaveCard";

const heading = "text-xl font-bold m-0 p-0 mb-3";
function AssociatedWaves({ waves }) {
  return (
    <div>
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
              updateWaveStatus={false}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssociatedWaves;
