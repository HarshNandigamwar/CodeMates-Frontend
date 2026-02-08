"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import {
  Loader2,
  Camera,
  Github,
  Linkedin,
  Globe,
  Lock,
  User,
  Info,
  Code2,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";

interface InputGroupProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  onTogglePassword?: () => void;
  isPasswordVisible?: boolean;
}

export default function EditProfilePage() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const MAX_BIO_LENGTH = 120;

  // States for form
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    portfolio: user?.portfolio || "",
    techstack: user?.techstack?.join(", ") || "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || "");
  const [showPassword, setShowPassword] = useState(false);

  // Cleanup for image preview
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Profile pic preview handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  // Update Profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);
      data.append("github", formData.github);
      data.append("linkedin", formData.linkedin);
      data.append("portfolio", formData.portfolio);
      data.append("techstack", formData.techstack);

      if (formData.password) data.append("password", formData.password);
      if (profilePic) data.append("profilePic", profilePic);

      await axiosInstance.put("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      router.push(`/profile/${user.username}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-accent">Edit Profile</h1>

          <form
            onSubmit={handleUpdate}
            className="space-y-6 bg-[#111111] p-8 rounded-2xl border border-zinc-800"
          >
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <img
                  src={previewUrl || "https://placehold.co/200x200"}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-zinc-800"
                  alt="Profile Preview"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                  <Camera size={30} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-zinc-500 text-xs mt-2 italic">
                Click photo to upload new picture
              </p>
            </div>

            {/* Basic Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Full Name"
                icon={<User size={18} />}
                value={formData.name}
                placeholder="Your Name"
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <InputGroup
                label="Tech Stack"
                icon={<Code2 size={18} />}
                value={formData.techstack}
                onChange={(v) => setFormData({ ...formData, techstack: v })}
                placeholder="React, NextJS, Node"
              />
            </div>

            {/* Bio Section with Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                  <Info size={18} /> Bio
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    formData.bio.length >= MAX_BIO_LENGTH
                      ? "text-red-500"
                      : "text-zinc-500"
                  }`}
                >
                  {formData.bio.length} / {MAX_BIO_LENGTH}
                </span>
              </div>
              <textarea
                className={`w-full bg-zinc-900 border ${
                  formData.bio.length >= MAX_BIO_LENGTH
                    ? "border-red-500/50"
                    : "border-zinc-800"
                } rounded-lg p-3 outline-none focus:border-accent min-h-[100px] transition-all text-sm`}
                value={formData.bio}
                maxLength={MAX_BIO_LENGTH}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Share a bit about yourself..."
              />
            </div>

            {/* Social Links & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="GitHub"
                icon={<Github size={18} />}
                value={formData.github}
                placeholder="https://github.com/..."
                onChange={(v) => setFormData({ ...formData, github: v })}
              />
              <InputGroup
                label="LinkedIn"
                icon={<Linkedin size={18} />}
                value={formData.linkedin}
                placeholder="https://linkedin.com/in/..."
                onChange={(v) => setFormData({ ...formData, linkedin: v })}
              />
              <InputGroup
                label="Portfolio"
                icon={<Globe size={18} />}
                value={formData.portfolio}
                placeholder="https://yourwebsite.com"
                onChange={(v) => setFormData({ ...formData, portfolio: v })}
              />
              <InputGroup
                label="New Password"
                icon={<Lock size={18} />}
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                type="password"
                placeholder="Leave blank to keep same"
                isPasswordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Buttons */} 
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent text-black font-bold py-3 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}

// Reusable Input Component
function InputGroup({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder = "",
  onTogglePassword,
  isPasswordVisible,
}: InputGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative">
        <input
          type={type === "password" && isPasswordVisible ? "text" : type}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none focus:border-accent text-sm text-white pr-10 transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-accent transition-colors cursor-pointer"
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
