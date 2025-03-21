// app/components/Feedback.tsx
'use client';

import React, { useState } from 'react';

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<string>('Waiting for your workout...');

  // Function to simulate feedback (replace with camera-based AI logic later)
  const giveFeedback = (formQuality: string) => {
    if (formQuality === 'good') {
      setFeedback('Your form looks great! Keep it up!');
    } else if (formQuality === 'bad') {
      setFeedback('Adjust your posture to avoid injury.');
    } else {
      setFeedback('Getting ready to analyze your form...');
    }
  };

  return (
    <div className="feedback">
      <h3>Form Feedback:</h3>
      <p>{feedback}</p>
      <button onClick={() => giveFeedback('good')}>Good Form</button>
      <button onClick={() => giveFeedback('bad')}>Bad Form</button>
      <button onClick={() => giveFeedback('waiting')}>Waiting...</button>
    </div>
  );
};

export default Feedback;
