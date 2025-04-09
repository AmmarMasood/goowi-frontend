import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Avatar, Tabs } from "antd";
import Overview from "./overview/Overview";
import SocialMetrics from "./social-metrics/SocialMetrics";
import Skeleton from "./skeleton/Skeleton";
import { getProfileBySlug } from "../../services/profile";
import MyWaves from "./my-waves/MyWaves";
import {
  getByCharityId,
  getCurrentUserWaves,
  getWavesByParticipantWithId,
} from "../../services/waves";
import AssociatedWaves from "./associated-waves/AssociatedWaves";
import SupportingCharities from "./supporting-charities/SupportingCharities";

const PublicProfile = () => {
  const navigate = useNavigate();
  // get slug from url
  const { slug } = useParams(); // Extract the slug from the URL
  const [searchParams] = useSearchParams(); // Get query parameters
  const [profile, setProfile] = useState(null);
  const [waves, setWaves] = useState([]);
  const [charityWaves, setCharityWaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("1"); // State for active tab key
  const [supportingWaves, setSupportingWaves] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await getProfileBySlug(slug);
      if (res.success) {
        setProfile(res.data);
      } else {
        console.error("Error fetching profile:", res.error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchWave = async () => {
    if (!profile) return;
    const res = await getCurrentUserWaves(profile?.userId?._id);
    if (res.success) {
      setWaves(res.data);
    }
  };

  const fetchAssociatedWaves = async () => {
    if (!profile) return;
    if (profile?.userId?.role !== "charity") return;
    const res = await getByCharityId(profile._id);
    if (res.success) {
      const associatedWaves = res.data.filter(
        (wave) => wave.creatorId._id !== profile._id
      );
      setCharityWaves(associatedWaves);
    }
  };
  const fetchSupportingWaves = async () => {
    if (!profile) return;

    const res = await getWavesByParticipantWithId(profile.userId._id);
    if (res.success) {
      setSupportingWaves(res.data);
    }
  };

  useEffect(() => {
    // Get the "tab" query parameter and set the active tab key
    const tab = searchParams.get("type");
    if (tab) {
      switch (tab) {
        case "profile":
          setActiveKey("1");
          break;
        case "charities":
          setActiveKey("2");
          break;
        case "metrics":
          setActiveKey("3");
          break;
        case "waves":
          setActiveKey("4");
          break;
        case "associated-waves":
          setActiveKey("5");
          break;
        case "supporting-waves":
          setActiveKey("6");
          break;
        default:
          setActiveKey("1");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (slug) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    fetchWave();
    fetchAssociatedWaves();
    fetchSupportingWaves();
  }, [profile]);

  const handleTabChange = (key) => {
    const tab =
      key === "1"
        ? "profile"
        : key === "2"
        ? "charities"
        : key === "3"
        ? "metrics"
        : key === "4"
        ? "waves"
        : key === "6"
        ? "supporting-waves"
        : "associated-waves";
    navigate(`?type=${tab}`, { replace: true });
  };

  const getTabsForRole = () => {
    switch (profile?.userId?.role) {
      case "charity":
        return [
          {
            key: "1",
            label: "Profile",
            children: (
              <Overview
                overview={profile?.overview}
                industry={profile?.industry}
                website={profile?.website}
                address={profile?.address}
                phone={profile?.phone}
                socialMediaLinks={profile?.socialMediaLinks}
                certifications={
                  profile?.certifications?.length > 0
                    ? profile.certifications
                    : null
                }
              />
            ),
          },
          {
            key: "4",
            label: "My Waves",
            children: <MyWaves waves={waves} getWaves={fetchWave} />,
          },
          {
            key: "5",
            label: "Associated Waves",
            children: (
              <AssociatedWaves
                waves={charityWaves}
                getWaves={fetchAssociatedWaves}
              />
            ),
          },
          {
            key: "6",
            label: "Supporting Charities",
            children: <SupportingCharities waves={supportingWaves} />,
          },
        ];
      case "person":
      case "company":
        return [
          {
            key: "1",
            label: "Profile",
            children: (
              <Overview
                overview={profile?.overview}
                industry={profile?.industry}
                website={profile?.website}
                address={profile?.address}
                phone={profile?.phone}
                socialMediaLinks={profile?.socialMediaLinks}
                certifications={
                  profile?.certifications?.length > 0
                    ? profile.certifications
                    : null
                }
              />
            ),
          },
          {
            key: "6",
            label: "Supporting Charities",
            children: <SupportingCharities waves={supportingWaves} />,
          },
          {
            key: "3",
            label: "Social Metrics",
            children: <SocialMetrics profile={profile} />,
          },
          {
            key: "4",
            label: "My Waves",
            children: <MyWaves waves={waves} getWaves={fetchWave} />,
          },
        ];
      default:
        return [];
    }
  };

  return loading ? (
    <Skeleton />
  ) : (
    <div className="bg-white shadow-md rounded-xl">
      <div className="relative h-42 w-full">
        {/* Banner Image */}
        {profile?.bannerImage && (
          <img
            src={profile?.bannerImage}
            alt="banner"
            className="object-cover w-full h-full rounded-t-xl"
          />
        )}
        {/* Profile Avatar */}
        <div className="absolute -bottom-6 left-6 transform translate-y-1/2 flex items-end">
          <Avatar
            src={profile?.logoImage}
            size={150}
            className="border-4 border-white shadow-md"
          />
          <div className="ml-3 mt-12">
            {profile.name ? (
              <h1 className="text-4xl">{profile.name}</h1>
            ) : (
              <h1 className="text-4xl">
                {profile?.userId?.firstName} {profile?.userId?.lastName}
              </h1>
            )}
            <h2 className="text-xl text-blue-950">{profile?.location}</h2>
            <p className="text-blue-950 text-md">{profile?.shortDescription}</p>
          </div>
        </div>
      </div>
      <div className="mt-32 p-4">
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onChange={handleTabChange}
          tabPosition="left"
          items={getTabsForRole()}
        />
      </div>
    </div>
  );
};

export default PublicProfile;
