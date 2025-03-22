// app/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db, doc, setDoc } from '../lib/firebase';
import SignInButton from './components/SignInButton';
import ChatBox from './components/ChatBox'; // Import the ChatBox component

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      // Store user data in Firestore
      const userRef = doc(db, 'users', session.user?.email!);
      setDoc(userRef, {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
        createdAt: new Date(),
      }, { merge: true });
    }
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>Welcome to the Gym Assistant</h1>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <img src={session.user?.image || '/default-avatar.png'} alt="User Avatar" />
      <button onClick={() => signOut()}>Sign out</button>

      {/* Add ChatBox component */}
      <ChatBox />
    </div>
  );
};

export default HomePage;
