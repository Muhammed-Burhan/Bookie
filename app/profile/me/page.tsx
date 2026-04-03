'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Loader2, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { usersApi } from '@/lib/api/users';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  password: z.string().min(8).optional().or(z.literal('')),
  password_confirmation: z.string().optional().or(z.literal('')),
  reading_goal: z.number().min(1).max(365).optional(),
}).refine((d) => {
  if (d.password && d.password !== d.password_confirmation) return false;
  return true;
}, { message: "Passwords don't match", path: ['password_confirmation'] });

type FormValues = z.infer<typeof schema>;

const GENRES = ['Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Historical', 'Non-Fiction', 'Thriller', 'Horror', 'Biography'];

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.preferences?.favorite_genres ?? []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      reading_goal: user?.preferences?.reading_goal ?? 12,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        bio: user.bio ?? '',
        reading_goal: user.preferences?.reading_goal ?? 12,
      });
      setSelectedGenres(user.preferences?.favorite_genres ?? []);
    }
  }, [user, reset]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        bio: data.bio,
        preferences: {
          favorite_genres: selectedGenres,
          reading_goal: data.reading_goal ?? 12,
        },
      };
      if (data.password) {
        payload.password = data.password;
        payload.password_confirmation = data.password_confirmation;
      }
      const updated = await usersApi.updateProfile(payload);
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-playfair font-black text-white"
          >
            Edit Profile
          </motion.h1>
          <p className="text-text-muted">Customize how you appear across Bookie.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-bg-secondary border border-border">
            <div className="w-20 h-20 rounded-full bg-bg-tertiary border-2 border-border overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-accent font-playfair">
                  {user?.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-white">{user?.name}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted" htmlFor="name">Display Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <User size={18} />
              </div>
              <input
                {...register('name')}
                type="text"
                id="name"
                className={cn(
                  "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                  errors.name && "border-error"
                )}
              />
            </div>
            {errors.name && <p className="text-xs text-error font-medium ml-1">{errors.name.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted" htmlFor="bio">Bio</label>
            <div className="relative group">
              <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <FileText size={18} />
              </div>
              <textarea
                {...register('bio')}
                id="bio"
                rows={3}
                className="w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                placeholder="Tell the community about yourself..."
              />
            </div>
          </div>

          {/* Favorite Genres */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-muted">Favorite Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre.toLowerCase())}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                    selectedGenres.includes(genre.toLowerCase())
                      ? "bg-accent/10 text-accent border-accent/30"
                      : "bg-bg-tertiary text-text-muted border-border hover:text-white"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Goal */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted" htmlFor="reading_goal">Reading Goal (books/year)</label>
            <input
              {...register('reading_goal', { valueAsNumber: true })}
              type="number"
              id="reading_goal"
              min={1}
              max={365}
              className="w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>

          {/* Change Password */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-bold text-white">Change Password <span className="text-text-muted font-normal text-sm">(optional)</span></h3>
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  className="w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password_confirmation')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={cn(
                    "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                    errors.password_confirmation && "border-error"
                  )}
                />
              </div>
              {errors.password_confirmation && <p className="text-xs text-error font-medium">{errors.password_confirmation.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-accent text-bg-primary font-bold py-4 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : saved ? (
              <><CheckCircle2 size={20} /> Saved!</>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
