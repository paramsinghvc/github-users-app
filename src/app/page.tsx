'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { createTheme, TextField, ThemeProvider } from '@mui/material';
import UserItem from './components/user-item';
import { RankedGithubUser } from '@/lib/github-service';

type FormData = {
  username: string;
  depth: number;
};

const theme = createTheme({
  palette: {
    primary: { main: '#6750a4' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          padding: '10px 24px',
        },
      },
    },
  },
});

export default function GitHubUsers() {
  const [users, setUsers] = useState<RankedGithubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
      const json = await res.json();
      setUsers(json);
    } catch {
      setApiError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <main className="max-w-screen-lg mx-auto p-6">
        <h1 className="text-2xl font-medium mb-4">GitHub User Ranker</h1>

        <form
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
        </form>

        {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}

        <div className="space-y-4 flex flex-wrap gap-8">
          {users.map((user) => (
            <UserItem user={user} key={user.login} />
          ))}
        </div>
      </main>
    </ThemeProvider>
  );
}
