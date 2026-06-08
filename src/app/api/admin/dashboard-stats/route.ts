import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ stats: null, leads: [], invoices: [] });
    }
    const sb = createAdminClient();
    const [leads, appts, preorders, invoices, purchases, products, stones, recentLeads, recentInv] = await Promise.all([
      sb.from("vip_leads").select("id,status"),
      sb.from("appointments").select("id,status"),
      sb.from("preorders").select("id,amount,payment_status"),
      sb.from("invoices").select("id,total,status"),
      sb.from("purchases").select("id,amount,payment_status"),
      sb.from("products").select("id,visible"),
      sb.from("stones").select("id,status"),
      sb.from("vip_leads").select("id,full_name,email,interest_type,status").order("created_at",{ascending:false}).limit(5),
      sb.from("invoices").select("id,invoice_number,client_name,total,status").order("created_at",{ascending:false}).limit(5),
    ]);
    return NextResponse.json({
      stats: {
        leads: leads.data?.length||0,
        newLeads: leads.data?.filter((x:{status:string})=>x.status==="new").length||0,
        appts: appts.data?.length||0,
        pendingAppts: appts.data?.filter((x:{status:string})=>x.status==="pending").length||0,
        preorders: preorders.data?.length||0,
        revenue: preorders.data?.filter((x:{payment_status:string})=>x.payment_status==="paid").reduce((s,x:{amount:number})=>s+x.amount,0)||0,
        unpaidInvoices: invoices.data?.filter((x:{status:string})=>x.status==="unpaid").length||0,
        totalInvoiced: invoices.data?.reduce((s,x:{total:number})=>s+(x.total||0),0)||0,
        purchases: purchases.data?.length||0,
        publishedProducts: products.data?.filter((x:{visible:boolean})=>x.visible).length||0,
        availableStones: stones.data?.filter((x:{status:string})=>x.status==="available").length||0,
      },
      leads: recentLeads.data||[],
      invoices: recentInv.data||[],
    });
  } catch(e) {
    console.error(e);
    return NextResponse.json({ stats:null, leads:[], invoices:[] });
  }
}
