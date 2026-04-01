import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// File upload endpoint for student submissions
// In production, this would integrate with Supabase Storage or similar
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const attemptId = formData.get("attemptId") as string;
    const processJournal = String(formData.get("processJournal") ?? "");
    const aiDeclaration = String(formData.get("aiDeclaration") ?? "");
    const toolsUsed = String(formData.get("toolsUsed") ?? "[]");
    const timeBreakdown = String(formData.get("timeBreakdown") ?? "{}");
    const wipScreenshotEntries = formData.getAll("wipScreenshots") as File[];

    // Validation
    if (!file || !attemptId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing file or attemptId",
        },
        { status: 400 }
      );
    }

    // File validation
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 50MB limit",
        },
        { status: 413 }
      );
    }

    // Check MIME type
    const allowedMimes = [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "text/plain",
      "text/csv",
      "application/json",
    ];

    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "File type not allowed. Please upload PDF, ZIP, or text files.",
        },
        { status: 400 }
      );
    }

    if (processJournal.trim().split(/\s+/).length < 150) {
      return NextResponse.json(
        {
          success: false,
          error: "Process journal must have at least 150 words",
        },
        { status: 400 }
      );
    }
    if (wipScreenshotEntries.length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "At least 1 WIP screenshot is required",
        },
        { status: 400 }
      );
    }
    if (wipScreenshotEntries.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 5 WIP screenshots allowed",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    let uploadedUrl = `https://storage.example.com/submissions/${attemptId}/${file.name}`;
    const uploadedWipUrls: string[] = [];

    if (supabase) {
      const basePath = `${attemptId}/${Date.now()}`;
      const submissionPath = `${basePath}/submission-${file.name}`;
      const { error: submissionError } = await supabase.storage
        .from("submissions")
        .upload(submissionPath, file, { cacheControl: "3600", upsert: false });
      if (submissionError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to upload submission file",
          },
          { status: 500 }
        );
      }
      uploadedUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/submissions/${submissionPath}`;

      for (const screenshot of wipScreenshotEntries) {
        const wipPath = `${basePath}/wip-${screenshot.name}`;
        const { error: wipError } = await supabase.storage
          .from("submissions")
          .upload(wipPath, screenshot, { cacheControl: "3600", upsert: false });
        if (!wipError) {
          uploadedWipUrls.push(
            `${process.env.SUPABASE_URL}/storage/v1/object/public/submissions/${wipPath}`
          );
        }
      }
    } else {
      for (const screenshot of wipScreenshotEntries) {
        uploadedWipUrls.push(
          `https://storage.example.com/submissions/${attemptId}/wip-${screenshot.name}`
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          url: uploadedUrl,
          name: file.name,
          size: file.size,
          processJournal,
          aiDeclaration,
          toolsUsed: JSON.parse(toolsUsed) as string[],
          timeBreakdown: JSON.parse(timeBreakdown) as Record<string, number>,
          wipScreenshots: uploadedWipUrls,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/upload/submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload submission",
      },
      { status: 500 }
    );
  }
}
