import React from "react";
import { ProfileComponentProps } from "@/types/interface";

const ProfileCategories: React.FC<ProfileComponentProps> = ({
  heading,
  description,
  onClick
}) => {
  return (
    <>
      <div className="profile__categories__container glossy_container" onClick={onClick}>
        <h3 className="text-center">{heading}</h3>
        <p>{description}</p>
      </div>
    </>
  );
};

export default ProfileCategories;
