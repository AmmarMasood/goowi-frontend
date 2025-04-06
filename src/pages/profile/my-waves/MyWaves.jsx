import React, { useEffect } from "react";
import WaveCard from "../../../components/WaveCard/WaveCard";
import UpdateWaveModal from "./edit-model/EditModel";
import { getCharities } from "../../../services/profile";
import { Loader } from "../../../components/Loader/Loader";
import { deleteWave } from "../../../services/waves";
import { message } from "antd";
const heading = "text-xl font-bold m-0 p-0 mb-3";
function MyWaves({ waves, getWaves }) {
  const [selectedWave, setSelectedWave] = React.useState(null);
  const [showEditModel, setShowEditModel] = React.useState(false);
  const [charities, setCharities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchCharities = async () => {
    setLoading(true);
    const res = await getCharities();
    if (res.success) {
      setCharities(res.data);
    } else {
      console.error("Error fetching charities:", res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const onEditWaveClick = (wave) => {
    setSelectedWave(wave);
    setShowEditModel(true);
  };
  const onDeleteWaveClick = async (wave) => {
    const res = await deleteWave(wave._id);
    if (res.success) {
      getWaves(); // Refresh the waves after deletion
      message.success("Wave deleted successfully");
    } else {
      message.error("Error deleting wave");
      console.error("Error deleting wave:", res.error);
    }
  };
  const onEditModalClose = () => {
    setShowEditModel(false);
    setSelectedWave(null);
  };
  const onUpdateSuccess = () => {
    setShowEditModel(false);
    setSelectedWave(null);
    getWaves(); // Refresh the charities after update
  };
  return (
    <div>
      <Loader loading={loading} />
      <UpdateWaveModal
        open={showEditModel}
        onClose={onEditModalClose}
        waveInfo={selectedWave}
        charities={charities}
        onUpdateSuccess={onUpdateSuccess}
      />
      <h1 className={heading}>My Waves</h1>
      {waves.length === 0 ? (
        <p>You have not created any waves yet.</p>
      ) : (
        <ul
          className="list-disc pl-5 "
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
              allowEdit={true}
              allowDelete={true}
              isUsersOwn={true}
              allowParticipation={false}
              onEditClick={onEditWaveClick}
              onDeleteClick={onDeleteWaveClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyWaves;
