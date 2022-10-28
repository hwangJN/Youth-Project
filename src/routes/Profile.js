import React from "react";

import ProfileUpdate from "../components/ProfileUpdate";

function Profile({ userObj, refreshUserObj }) {
  return (
    <div>
      <ProfileUpdate userObj={userObj} refreshUserObj={refreshUserObj} />
    </div>
  );
}
export default Profile;
