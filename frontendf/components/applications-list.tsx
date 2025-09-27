"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getApplicationsByJob, deleteApplication } from "@/lib/applications";
import { format } from "date-fns";

export function ApplicationsList({ jobId }: { jobId: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!jobId) {
          toast({
            title: "Error",
            description: "No job ID provided",
            variant: "destructive",
          });
          return;
        }

        setLoading(true);
        const data = await getApplicationsByJob(jobId);

        if (isMounted) {
          setApplications(data || []);
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load applications",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast({ title: "Success", description: "Application deleted" });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.message || "Delete failed",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "PPpp");
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No applications found</CardTitle>
          <CardDescription>
            {jobId
              ? "No applications have been submitted for this job yet."
              : "No job ID provided - cannot fetch applications."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app._id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{app.fullName}</h3>
                <p className="text-muted-foreground">{app.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Applied on {formatDate(app.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {app.resumeUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(app.resumeUrl, "_blank")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(app._id)}
                  disabled={deletingId === app._id}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingId === app._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
            {app.coverLetter && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {app.coverLetter}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
