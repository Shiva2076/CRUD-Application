import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink, Building, MapPin } from "lucide-react";

export function JobCard({ job }) {
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A";

    try {
      // Handle string, Date object, or Firestore Timestamp (for safety)
      const date =
        dateValue instanceof Date
          ? dateValue
          : typeof dateValue === "string"
          ? new Date(dateValue)
          : dateValue.toDate
          ? dateValue.toDate()
          : null;

      return date ? date.toLocaleDateString() : "N/A";
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <CardTitle className="text-xl">{job.title}</CardTitle>
          </div>
        </div>
        
        {/* Company and Location Info */}
        <div className="space-y-1">
          {job.company && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}
        </div>
        
        <CardDescription>
          Created on {formatDate(job.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-muted-foreground">
          {job.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/apply/${job._id || job.id}`} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Application
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/jobs/${job._id || job.id}`}>Manage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}