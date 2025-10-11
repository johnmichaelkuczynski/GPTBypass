import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoInstructions() {
  const videoPath = "/attached_assets/instructional-video.mp4";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button 
              variant="outline" 
              className="gap-2"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Page
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Instructional Video
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
            <video 
              controls 
              preload="metadata"
              className="w-full rounded-lg"
              data-testid="video-instructions"
              src={videoPath}
            >
              Your browser does not support the video tag.
            </video>

            <div className="mt-6 text-gray-600 dark:text-gray-400">
              <p className="text-sm">
                Watch this comprehensive tutorial to learn how to use GPT Bypass effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
