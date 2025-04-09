import { Skeleton, Statistic, Tag } from "antd";
import React, { useEffect } from "react";
import {
  LikeOutlined,
  SwapOutlined,
  SmileOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { getUserMetrics } from "../../../services/profile";

const heading = "text-xl font-bold m-0 p-0 mb-3";
const text = "text-gray-500 text-md font m-0 p-0 mb-2";
function SocialMetrics({ profile }) {
  const [loading, setLoading] = React.useState(false);
  const [metrics, setMetrics] = React.useState({
    totalWavesCreated: 0,
    totalWavesParticipated: 0,
    uniqueCharitiesSupported: 0,
    totalUniqueParticipants: 0,
    causeNames: [],
  });
  const fetchMetrics = async () => {
    if (!profile) return;
    setLoading(true);
    const res = await getUserMetrics(profile._id);
    if (res.success) {
      setMetrics(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, [profile]);

  return loading ? (
    <Skeleton />
  ) : (
    <div>
      <h1 className={heading}>SocialMetrics</h1>
      <div>
        <h1 className={text}>Top Causes Supported</h1>
        {metrics.causeNames.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {metrics.causeNames.map((cause) => (
              <Tag key={cause} color="blue" style={{ fontSize: "18px" }}>
                {cause}
              </Tag>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Statistic
            title="Waves Supported"
            value={metrics.totalWavesParticipated}
            prefix={<FormOutlined />}
          />
          <Statistic
            title="Waves Created"
            value={metrics.totalWavesCreated}
            prefix={<SwapOutlined />}
          />
          <Statistic
            title="Charities Supported"
            value={metrics.uniqueCharitiesSupported}
            prefix={<SmileOutlined />}
          />
          <Statistic
            title="Total Participants in created waves"
            value={metrics.totalUniqueParticipants}
            prefix={<LikeOutlined />}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialMetrics;
