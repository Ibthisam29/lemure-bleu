import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("vip_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      return new NextResponse("No data", { status: 200 });
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row =>
        headers.map(h => {
          const val = String(row[h] || "").replace(/"/g, '""');
          return `"${val}"`;
        }).join(",")
      ),
    ];

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="lemure-blue-leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
