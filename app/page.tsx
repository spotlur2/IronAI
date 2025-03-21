// app/page.tsx

import React from 'react';
import ChatBox from './components/ChatBox';
import Feedback from './components/Feedback';
import Camera from './components/Camera';

const Page: React.FC = () => {
  return (
    <div className="container">
      <h2>Welcome to the AI Gym Assistant!</h2>
      <Camera />  {/* Camera component for live feedback */}
      <ChatBox />
      <Feedback />
    </div>
  );
};

export default Page;
