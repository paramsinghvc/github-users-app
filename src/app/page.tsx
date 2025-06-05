'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion';

import UserItem from './components/user-item';
import { RankedGithubUser } from '@/lib/github-service';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import SortButton, { SortOption } from './components/sort-button';
import { useAppState } from './contexts/AppStateContext';
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';

type FormData = {
  username: string;
  depth: number;
};

export default function GitHubUsers() {
  const { get, set } = useAppState();
  const loadedUsers = get('loadedUsers');
  const dotLottieRef = useRef<DotLottie>(null);

  const [users, setUsers] = useState<RankedGithubUser[]>(loadedUsers);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    visibleData: visibleUsers,
    loaderRef,
    hasMore,
    loadMore,
  } = useInfiniteScroll<RankedGithubUser>(users, 6);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: 'paramsinghvc', depth: 2 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setUsers([]);
    setApiError('');
    try {
      const res = await fetch(
        `/api/github-users?username=${data.username}&depth=${data.depth}`
      );
      if (!res.ok) throw new Error();
      const users = await res.json();
      setUsers(users);
      set('loadedUsers', users);
    } catch {
      setApiError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy: SortOption) => {
    const sortedUsers = sortUsers(users, sortBy);
    setUsers(sortedUsers);
    set('loadedUsers', sortedUsers);

    function sortUsers(users: RankedGithubUser[], sortBy: SortOption) {
      switch (sortBy) {
        case 'Username':
          return [...users].sort((a, b) => a.login.localeCompare(b.login));
        case 'Ranking':
          return [...users].sort((a, b) => b.followersCount - a.followersCount);
        case 'Created Date':
          return [...users].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
      }
    }
  };

  useEffect(() => {
    if (loading) dotLottieRef.current?.play();
    else dotLottieRef.current?.pause();
  }, [loading]);

  const isInitialState = users.length === 0 && !apiError;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 z-50"
      >
        + Skip to content +{' '}
      </a>
      <main
        id="#main-content"
        className={`flex flex-col items-center max-h-screen overflow-hidden ${
          loading && 'bg-purple-50'
        }`}
      >
        <motion.header
          layout
          className={`flex-shrink-0 flex flex-col items-center justify-center mx-auto w-screen p-6 ${
            isInitialState ? 'h-screen' : 'bg-purple-50'
          }`}
        >
          <motion.h1 layout className="text-2xl font-medium mb-4">
            GitHub User Ranker
          </motion.h1>

          <motion.div
            className={`h-[500px] w-[500px] ${!isInitialState && 'hidden'}`}
            role="presentation"
          >
            <DotLottieReact
              src="https://lottie.host/9eda8328-3d03-43c5-924c-4707caebde09/9Xc3cgJBsn.lottie"
              speed={1}
              loop
              width="500px"
              height="500px"
              dotLottieRefCallback={(dotLottie) => {
                dotLottieRef.current = dotLottie;
              }}
            />
          </motion.div>

          <motion.form
            layout
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 my-8 flex items-stretch gap-8"
          >
            <TextField
              variant="filled"
              label="GitHub Username"
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message}
              autoFocus
            />
            <TextField
              type="number"
              variant="filled"
              label="Depth (1-5)"
              {...register('depth', {
                required: 'Depth is required',
                min: { value: 1, message: 'Min 1' },
                max: { value: 5, message: 'Max 5' },
              })}
              error={!!errors.depth}
              helperText={errors.depth?.message}
            />
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              disableElevation
            >
              {loading ? 'Loading...' : 'Fetch Ranked Users'}
            </Button>
          </motion.form>
        </motion.header>
        <motion.div
          className="flex-grow w-full max-w-screen-lg p-4 overflow-y-auto"
          layout
        >
          {apiError && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-red-600 text-sm mb-4"
            >
              {apiError}
            </p>
          )}
          <div className="flex flex-col items-center gap-8 pt-4">
            {visibleUsers.length > 0 && (
              <SortButton
                onSortChange={handleSortChange}
                className="self-end"
              />
            )}

            <div className=" pb-[100px] overflow-auto flex flex-col items-center">
              <motion.ul className="space-y-4 flex flex-wrap gap-8 pb-20 list-none">
                {visibleUsers.map((user) => (
                  <motion.li
                    key={user.login}
                    layout
                    layoutId={`avatar-${user.login}`}
                  >
                    <UserItem user={user} />
                  </motion.li>
                ))}
              </motion.ul>
              {hasMore && (
                <Button
                  disabled={loading}
                  variant="outlined"
                  href=""
                  disableElevation
                  onClick={loadMore}
                  ref={loaderRef}
                  aria-label="Load more users"
                >
                  Load More
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
