/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { RankedGithubUser } from '@/lib/github-service';
import { Hash, Clock } from 'react-feather';

export default function UserItem({ user }: { user: RankedGithubUser }) {
  return (
    <div
      key={user.login}
      className="flex items-center gap-4 h-[300px] w-[300px] rounded-3xl shadow-sm hover:shadow-md transition overflow-hidden relative"
    >
      <img
        src={user.avatar_url}
        alt={user.login}
        className="object-cover w-full h-full"
      />
      <div
        className="absolute w-full h-[100px] bottom-0"
        style={{
          mask: 'linear-gradient(transparent, black, black)',
          backdropFilter: 'blur(20px)',
        }}
      ></div>
      <div className="text-white flex flex-col absolute w-full h-[100px] bottom-0 p-6 items-center justify-end gap-2">
        <p className="font-bold text-lg text-center w-full">@{user.login}</p>
        <div className="flex justify-evenly w-full text-sm">
          <div className="flex items-center gap-1">
            <Hash size={16} />
            {user.followersCount} followers
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            Since {formatToMonthYear(user.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Formats a date string to "Mon YYYY" as "Sep 2011"
export function formatToMonthYear(
  input: string | Date | number | null | undefined
): string {
  if (!input) return '';

  try {
    const date = input instanceof Date ? input : new Date(input);

    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}
