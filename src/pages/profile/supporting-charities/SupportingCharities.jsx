import React from "react";
import WaveCard from "../../../components/WaveCard/WaveCard";

const heading = "text-xl font-bold m-0 p-0 mb-3";
function SupportingCharities({ waves }) {
  return (
    <div>
      <h1 className={heading}>Supporting Waves</h1>
      {waves.length === 0 ? (
        <p>You do not support any waves right now.</p>
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
              allowParticipation={false}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupportingCharities;
