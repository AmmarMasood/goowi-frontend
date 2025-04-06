import React from "react";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  Carousel,
  Switch,
} from "antd";
import {
  EditFilled,
  EnvironmentFilled,
  LinkOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  DeleteFilled,
  DislikeOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

function WaveCard({
  waveInfo,
  onHome,
  onEditClick,
  isUsersOwn,
  allowEdit,
  allowDelete,
  onDeleteClick,
  isCharity,
  currentUser,
  onParticipate,
  onComment,
  className,
  updateWaveStatus,
  allowParticipation,
}) {
  const { userDetails } = useAuth();
  const {
    title,
    shortDescription,
    longDescription,
    causeName,
    charityId,
    supportTypes,
    location,
    eventLink,
    imageUrls,
    tags,
    hashtag,
    allowComments,
    comments,
    participants,
    charityApprovalStatus,
    creatorId,
  } = waveInfo;

  // Format support types for display
  const formatSupportType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Check if current user is already a participant
  const isParticipant = participants?.some((p) => {
    if (p._id) {
      return p._id === userDetails?._id;
    }
    return p === userDetails?._id;
  });

  // Get participant count
  const participantCount = participants?.length || 0;

  // Get approved comment count
  const approvedCommentCount =
    comments?.filter((c) => c.isApproved).length || 0;

  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Card Header with creator info */}
      <div className="flex items-center mb-3">
        <Avatar src={creatorId?.logoImage} size={42} className="mr-4" />
        <div className="flex-1 ml-3">
          <h4 className="m-0 font-medium">
            {creatorId?.name ||
              `${creatorId?.userId?.firstName} ${creatorId?.userId?.lastName}` ||
              "Anonymous"}
          </h4>
          <p className="text-gray-500 text-sm m-0">
            {causeName &&
              `Supporting: ${waveInfo?.charityId?.name} for ${causeName}`}
          </p>
        </div>
        {isUsersOwn && allowEdit && (
          <Tooltip title="Edit Wave">
            <EditFilled
              className="text-xl cursor-pointer text-blue-500"
              onClick={() => onEditClick(waveInfo)}
            />
          </Tooltip>
        )}
        {isUsersOwn && allowDelete && (
          <Tooltip title="Delete Wave">
            <Popconfirm
              title="Delete the wave"
              description="Are you sure to delete this wave?"
              onConfirm={() => onDeleteClick(waveInfo)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteFilled className="text-xl cursor-pointer text-red-500 ml-4" />
            </Popconfirm>
          </Tooltip>
        )}
        {!isUsersOwn &&
          userDetails?._id === waveInfo?.charityId._id &&
          updateWaveStatus && (
            <div>
              {charityApprovalStatus === "pending" && (
                <>
                  <Tooltip title="Approve this wave">
                    <Button
                      type="primary"
                      icon={<LikeOutlined />}
                      onClick={() => updateWaveStatus(waveInfo._id, "approved")}
                      className="ml-4"
                    ></Button>
                  </Tooltip>
                  <Tooltip title="Reject this wave">
                    <Button
                      type="primary"
                      icon={<DislikeOutlined />}
                      onClick={() => updateWaveStatus(waveInfo._id, "rejected")}
                      className="ml-4"
                    ></Button>
                  </Tooltip>
                </>
              )}
            </div>
          )}
      </div>

      {/* Wave title and description */}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-3">{shortDescription}</p>

      {/* Support Types */}
      {supportTypes && supportTypes.length > 0 && (
        <div className="mb-3">
          <p className="font-medium mb-1">Looking for:</p>
          <div className="flex flex-wrap gap-2">
            {supportTypes.map((type, index) => (
              <Tag key={index} color="blue">
                {formatSupportType(type)}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Location and event link */}
      {(location || eventLink) && (
        <div className="mb-3">
          {location && (
            <p className="flex items-center mb-1">
              <EnvironmentFilled className="mr-2 text-gray-600" />
              {location}
            </p>
          )}
          {eventLink && (
            <p className="flex items-center mb-1">
              <LinkOutlined className="mr-2 text-gray-600" />
              <a href={eventLink} target="_blank" rel="noopener noreferrer">
                Event Details
              </a>
            </p>
          )}
        </div>
      )}

      {/* Images */}
      {imageUrls && imageUrls.length > 0 && (
        <div className="mb-3">
          {imageUrls.length === 1 ? (
            <div className="w-full rounded-lg overflow-hidden">
              <img
                src={imageUrls[0]}
                alt={title}
                className="w-full h-64 object-cover"
              />
            </div>
          ) : (
            <Carousel arrows infinite={false}>
              {imageUrls.slice(0, 4).map((img, index) => (
                <div key={index} className="w-full rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      )}

      {/* Tags and hashtag */}
      {(tags?.length > 0 || hashtag) && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {hashtag && <Tag color="green">#{hashtag}</Tag>}
          </div>
        </div>
      )}
      {/* Charity Approval Status */}
      {charityId && (
        <div className="mb-3">
          <Tag
            color={
              charityApprovalStatus === "approved"
                ? "green"
                : charityApprovalStatus === "rejected"
                ? "red"
                : "orange"
            }
          >
            Charity Status:{" "}
            {charityApprovalStatus.charAt(0).toUpperCase() +
              charityApprovalStatus.slice(1)}
          </Tag>
        </div>
      )}

      <Divider className="my-3" />

      {/* Stats row */}
      <div className="flex text-sm text-gray-500 mb-3">
        <Tooltip
          title={
            participants
              ?.map((p) => {
                return p.userId.firstName + " " + p.userId.lastName;
              })
              ?.join(", ") || "No participants yet"
          }
        >
          {" "}
          <div className="mr-4">
            <UserAddOutlined className="mr-1" />
            {participantCount}{" "}
            {participantCount === 1 ? "participant" : "participants"}
          </div>
        </Tooltip>
        {/* {allowComments && (
          <div>
            <MessageOutlined className="mr-1" />
            {approvedCommentCount}{" "}
            {approvedCommentCount === 1 ? "comment" : "comments"}
          </div>
        )} */}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        {allowParticipation && (
          <Button
            type={isParticipant ? "primary" : "default"}
            icon={<UserAddOutlined />}
            disabled={isParticipant}
            onClick={() => onParticipate(waveInfo._id)}
            className="flex-1 mr-2"
          >
            {isParticipant ? "Participating" : "Participate"}
          </Button>
        )}

        {/* {allowComments && (
          <Button
            icon={<MessageOutlined />}
            onClick={() => onComment(waveInfo._id)}
            className="flex-1 mr-2"
          >
            Comment
          </Button>
        )}

        <Button icon={<ShareAltOutlined />} className="flex-1">
          Share
        </Button> */}
      </div>
    </Card>
  );
}

export default WaveCard;
