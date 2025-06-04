import * as R from 'ramda';

export type GitHubUser = {
  login: string;
  id: number;
  html_url: string;
  avatar_url: string;
  created_at: string;
  followersList?: GitHubUser[];
};

export type RankedGithubUser = GitHubUser & { followersCount: number };

const PAGE_SIZE = 3;
const AUTH_TOKEN = process.env.GITHUB_PAT!; // Defined in .env.local

const mapToArray = <T>(map: Map<string, T>): T[] => Array.from(map.values());
const pickMinimalUserFields = R.pick([
  'login',
  'id',
  'html_url',
  'avatar_url',
  'created_at',
]);
const attachFollowersList = (followers: GitHubUser[]) =>
  R.assoc('followersList', followers);
const attachFollowersCount = (
  count: number,
  user: GitHubUser
): RankedGithubUser => R.assoc('followersCount', count, user);

async function getUserFollowers(username: string): Promise<GitHubUser[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/followers?per_page=${PAGE_SIZE}`,
    {
      headers: { Authorization: AUTH_TOKEN },
    }
  );
  const raw = (await res.json()) as GitHubUser[];
  return R.map(pickMinimalUserFields, raw);
}

async function getUserData(username: string): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Authorization: AUTH_TOKEN },
  });
  const raw = await res.json();
  return pickMinimalUserFields(raw) as GitHubUser;
}

export async function getUsers(
  username: string,
  maxDepth: number
): Promise<RankedGithubUser[]> {
  const usersMap = new Map<string, GitHubUser>();

  async function traverse(user: GitHubUser, depth: number): Promise<void> {
    if (depth > maxDepth || usersMap.has(user.login)) return;
    const followers = await getUserFollowers(user.login);
    const enrichedUser = attachFollowersList(followers)(user);
    usersMap.set(user.login, enrichedUser);
    for (const follower of followers) {
      const enrichedFollower = await getUserData(follower.login); // For getting the created_at date
      await traverse(enrichedFollower, depth + 1);
    }
  }

  const rootUser = await getUserData(username);
  await traverse(rootUser, 1);

  const countFollowers = (
    user: GitHubUser,
    seen = new Set<string>()
  ): number => {
    if (!usersMap.has(user.login) || seen.has(user.login)) return 0;
    seen.add(user.login);
    const followers = usersMap.get(user.login)?.followersList ?? [];
    return R.reduce<GitHubUser, number>(
      (sum, follower) => sum + 1 + countFollowers(follower, seen),
      0,
      followers
    );
  };

  const addFollowersCount = R.converge(attachFollowersCount, [
    countFollowers,
    R.identity,
  ]);
  return R.pipe(mapToArray<GitHubUser>, R.map(addFollowersCount))(usersMap);
}
