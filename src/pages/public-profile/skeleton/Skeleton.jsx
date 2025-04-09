import React from "react";
import { Skeleton as AntdSkeleton } from "antd";

function Skeleton() {
  return (
    <div>
      <AntdSkeleton active />
      <AntdSkeleton active className="my-5" />
      <AntdSkeleton active />
      <AntdSkeleton active className="my-5" />
    </div>
  );
}

export default Skeleton;
