"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Briefcase,
  Clipboard,
  Trash2,
} from "lucide-react";
import { ApplicationsList } from "@/components/applications-list";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getJob, deleteJob } from "@/lib/jobs"; // ✅ backend jobs API

export default function JobDetailsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const router = useRouter();
  const { jobId } = params;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Fetch job details
  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJob(jobId);
        setJob(data);
      } catch (err: any) {
        console.error("Error fetching job:", err);
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load job details",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  // 🔹 Copy job apply link
  const copyApplicationLink = () => {
    if (!jobId) return;
    const applicationLink = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(applicationLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Application link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔹 Delete job
  const handleDeleteJob = async () => {
    if (!jobId) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await deleteJob(jobId, token!);
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error deleting job:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-64 w-full max-w-4xl mx-auto mb-6" />
      </div>
    );
  }

  // 🔹 Job not found
  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Job Not Found</CardTitle>
            <CardDescription className="text-center">
              The job you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔹 Main UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto mb-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>{job?.title}</CardTitle>
            </div>
            <CardDescription>
              Created on{" "}
              {job?.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "N/A"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyApplicationLink}>
              {copied ? "Copied!" : "Copy Link"}
              <Clipboard className="ml-2 h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the job and all associated
                    applications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteJob}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <div className="whitespace-pre-line">{job?.description}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="applications" className="max-w-4xl mx-auto">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <ApplicationsList jobId={jobId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
