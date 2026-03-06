"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function ProfileForm() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error: fetchError } = await supabase.auth.getUser();
      if (fetchError || !user) {
        setError("Unable to load profile. Please try logging in again.");
      } else {
        setEmail(user.email ?? "");
        setFullName(user.user_metadata?.full_name ?? "");
        setCompanyName(user.user_metadata?.company_name ?? "");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleFieldChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: fullName, company_name: companyName },
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-500">Loading profile…</span>
      </div>
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your account details below.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSave} className="space-y-5">
          {/* Email – read-only */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email cannot be changed here.</p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <User className="h-4 w-4 text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={handleFieldChange(setFullName)}
              placeholder="e.g. Nitish Kumar"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Building2 className="h-4 w-4 text-gray-400" />
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={handleFieldChange(setCompanyName)}
              placeholder="e.g. Acme Textiles Pvt. Ltd."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
