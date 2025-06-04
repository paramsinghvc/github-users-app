'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import UserAvatar from '@/app/components/user-avatar';
import { useAppState } from '@/app/contexts/AppStateContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, ExternalLink, Hash } from 'react-feather';
import { formatToMonthYear } from '@/app/components/user-item';
import { Button } from '@mui/material';

export default function UserDetailPage() {
  const { username } = useParams();

  const { get } = useAppState();
  const selectedUser = get('selectedUser');

  const [user, setUser] = useState(selectedUser);
  const [loading, setLoading] = useState(!selectedUser);

  useEffect(() => {
    if (!selectedUser) {
      fetch(`/api/github-user/${username}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .finally(() => setLoading(false));
    }
  }, [username, selectedUser]);

  if (!username || Array.isArray(username)) return null;

  if (!user || loading) return <p>Loading...</p>;

  return (
    <main className="max-w-screen-md mx-auto p-6 pt-8 bg-purple-50 h-screen relative">
      <Link
        href="/"
        scroll={false}
        className="flex items-center sm:ml-2 md:ml-8 "
      >
        <Button aria-label="Go back to home page">
          <ArrowLeft size={36} />
        </Button>
      </Link>

      <section className="flex justify-center w-full pt-4">
        <UserAvatar
          src={user.avatar_url}
          layoutId={`avatar-${user.login}`}
          size={128}
          alt={user.login}
        />
      </section>

      {/* Bottom Sheet */}
      <AnimatePresence>
        <motion.section
          className="bg-white w-full absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-lg h-[60vh] md:h-[50vh] sm:h-[80vh] flex flex-col items-center p-8"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.h1
            layoutId={`name-${user.login}`}
            className="text-2xl font-bold"
          >
            @{user.login}
          </motion.h1>
          <div className="flex justify-evenly w-full text-md p-16 flex-col md:flex-row text-md items-center gap-4">
            <div className="flex items-center gap-2">
              <Hash size={20} />
              {user.followersCount} followers
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              Since {formatToMonthYear(user.created_at)}
            </div>
          </div>
          <Button
            href={user.html_url}
            target="_blank"
            variant="outlined"
            disableElevation
            className="flex items-baseline-last gap-2"
          >
            Visit Profile{' '}
            <ExternalLink size={16} className="relative bottom-0.5" />
          </Button>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
