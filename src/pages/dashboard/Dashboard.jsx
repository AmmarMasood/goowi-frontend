import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "../profile/skeleton/Skeleton";
import { Button, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllHashTags, participateInWave } from "../../services/waves";
import { getWaves } from "../../services/dashboard";
import WaveCard from "../../components/WaveCard/WaveCard";

const heading = "text-xl font-bold m-0 p-0";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [allWaves, setAllWaves] = useState([]);
  const [fillteredWaves, setFilteredWaves] = useState([]);
  const [topHashTags, setTopHashtags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails && userDetails.profileExists === false) {
      navigate("/complete-registration", { replace: true });
    }
  }, [userDetails]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await fetchHashTags();
    await fetchWaves();
    setLoading(false);
  };

  const fetchWaves = async (
    hashtags = [],
    title = "",
    page = 1,
    limit = 100
  ) => {
    setLoading(true);
    const res = await getWaves(hashtags, title, page, limit);
    if (res.success) {
      setAllWaves(res.data.data);
      setFilteredWaves(res.data.data);
    } else {
      console.error("Error fetching waves:", res.error);
    }
    setLoading(false);
  };
  const fetchHashTags = async () => {
    const res = await getAllHashTags();
    if (res.success) {
      setTopHashtags(res.data);
    } else {
      console.error("Error fetching hashtags:", res.error);
    }
  };
  const handleTagSelection = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);

    const filteredWaves = allWaves.filter((wave) =>
      nextSelectedTags.includes(wave.hashtag)
    );
    if (nextSelectedTags.length === 0) {
      setFilteredWaves(allWaves);
    } else {
      setFilteredWaves(filteredWaves);
    }
  };

  const onParticipate = async (waveId) => {
    const res = await participateInWave(waveId);
    if (res.success) {
      const updatedWaves = allWaves.map((wave) => {
        if (wave._id === waveId) {
          return {
            ...wave,
            participants: [
              ...wave.participants,
              {
                ...userDetails,
                userId: {
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                },
              },
            ],
          };
        }
        return wave;
      });
      const updatedFWaves = fillteredWaves.map((wave) => {
        if (wave._id === waveId) {
          return {
            ...wave,
            participants: [
              ...wave.participants,
              {
                ...userDetails,
                userId: {
                  firstName: userDetails.firstName,
                  lastName: userDetails.lastName,
                },
              },
            ],
          };
        }
        return wave;
      });
      console.log("updatedWaves", updatedWaves);
      setAllWaves(updatedWaves);
      setFilteredWaves(updatedFWaves);
    } else {
      console.error("Error participating in wave:", res.error);
    }
  };
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredWaves = allWaves.filter((wave) =>
      wave.title.toLowerCase().includes(searchValue)
    );
    setFilteredWaves(filteredWaves);
    if (searchValue === "") {
      setFilteredWaves(allWaves);
    }
  };

  return loading ? (
    <Skeleton />
  ) : (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h1 className={heading}>Explore</h1>
        <Link to="/new-wave">
          <Button type="primary">New Wave</Button>
        </Link>
      </div>
      <Input
        onChange={handleSearch}
        placeholder="Search with wave title..."
        className="mb-4 mt-4"
        size="large"
        prefix={<SearchOutlined />}
      />
      {topHashTags.map((tag) => (
        <Tag.CheckableTag
          className="!text-lg"
          key={tag}
          checked={selectedTags.includes(tag)}
          onChange={(checked) => handleTagSelection(tag, checked)}
        >
          #{tag}
        </Tag.CheckableTag>
      ))}

      <div
        className="min-h-5 mt-8 "
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gap: "20px",
        }}
      >
        {fillteredWaves.length <= 0 ? (
          <h1 className="text-xl text-center">No Waves Found</h1>
        ) : (
          fillteredWaves.map((wave) => (
            <>
              <WaveCard
                key={wave._id}
                isUsersOwn={false}
                onHome={true}
                allowEdit={false}
                allowDelete={false}
                allowParticipation={
                  wave.creatorId._id !== userDetails._id &&
                  wave.charityId._id !== userDetails._id
                }
                waveInfo={wave}
                onParticipate={onParticipate}
              />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
