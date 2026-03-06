import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "Profile | MSME Growth OS",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal and company account details.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
