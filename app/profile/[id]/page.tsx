'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User as UserIcon, BookOpen, MessageCircle, Star, Loader2, Calendar } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { User, Rating, Opinion } from '@/lib/types';
import { formatScore, getRatingColorTheme } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface UserProfile extends User {
  ratings_count: number;
  opinions_count: number;
}

export default function PublicProfilePage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ratings' | 'opinions'>('ratings');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [profileData, ratingsData, opinionsData] = await Promise.all([
          usersApi.getProfile(id),
          usersApi.getUserRatings(id),
          usersApi.getUserOpinions(id),
        ]);
        setProfile(profileData);
        setRatings(ratingsData.data);
        setOpinions(opinionsData.data);
      } catch {
        // handle 404
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <UserIcon size={64} className="mx-auto text-text-muted/20" />
          <h2 className="text-2xl font-playfair font-bold text-white">User not found</h2>
          <Link href="/" className="text-accent hover:underline">Return to Sanctuary</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 rounded-[40px] bg-bg-secondary border border-border glass"
        >
          <div className="w-28 h-28 rounded-full bg-bg-tertiary border-4 border-border overflow-hidden flex-shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-accent font-playfair">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-playfair font-black text-white">{profile.name}</h1>
              {profile.bio && <p className="text-text-muted mt-2 leading-relaxed">{profile.bio}</p>}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 text-text-muted">
                <Star size={16} className="text-accent" />
                <span className="font-bold text-white">{profile.ratings_count}</span>
                <span className="text-sm">Ratings</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <MessageCircle size={16} className="text-accent" />
                <span className="font-bold text-white">{profile.opinions_count}</span>
                <span className="text-sm">Opinions</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar size={16} className="text-accent" />
                <span className="text-sm">Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {profile.preferences?.favorite_genres && profile.preferences.favorite_genres.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.preferences.favorite_genres.map((genre) => (
                  <span key={genre} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-0">
          {(['ratings', 'opinions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px",
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-white"
              )}
            >
              {tab === 'ratings' ? `Ratings (${ratings.length})` : `Opinions (${opinions.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            {ratings.length === 0 ? (
              <p className="text-text-muted text-center py-16">No ratings yet.</p>
            ) : (
              ratings.map((rating) => (
                <div key={rating.id} className="flex items-center gap-6 p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent/20 transition-all">
                  {rating.book?.cover_url && (
                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img src={rating.book.cover_url} alt={rating.book.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/books/${rating.book_id}`} className="font-bold text-white hover:text-accent transition-colors line-clamp-1">
                      {rating.book?.title ?? 'Unknown'}
                    </Link>
                    <p className="text-xs text-text-muted">{rating.book?.author}</p>
                  </div>
                  {rating.score !== null && (
                    <span className={cn("text-2xl font-jetbrains font-black", getRatingColorTheme(rating.score))}>
                      {formatScore(rating.score)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'opinions' && (
          <div className="space-y-4">
            {opinions.length === 0 ? (
              <p className="text-text-muted text-center py-16">No opinions yet.</p>
            ) : (
              opinions.map((opinion) => (
                <div key={opinion.id} className="p-6 rounded-2xl bg-bg-secondary border border-border space-y-3">
                  <Link href={`/books/${opinion.book_id}`} className="font-bold text-accent hover:underline text-sm">
                    {opinion.book?.title ?? 'Unknown Book'}
                  </Link>
                  <p className="text-text-muted leading-relaxed text-sm">"{opinion.content}"</p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>{opinion.likes_count} likes</span>
                    <span>{new Date(opinion.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
