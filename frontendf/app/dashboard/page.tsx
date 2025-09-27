"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Briefcase, LogOut } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import API from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // ✅ get logged-in user
        const me = await API.get("/auth/me");
        setUser(me.data.user);

        // ✅ get jobs
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Admin Dashboard
          </h1>
          {user && (
            <p className="text-muted-foreground">
              Welcome, {user.name || user.email}
            </p>
          )}
        </div>
        {user && (
          <div className="flex gap-2">
            <Link href="/dashboard/create-job">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
        {jobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No jobs found</CardTitle>
              <CardDescription>
                Create your first job posting to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/create-job">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
