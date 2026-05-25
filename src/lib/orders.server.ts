import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const createOrder = createServerFn({ method: "POST" })
  .handler(async (ctx: { data: any }) => {
    const { orderData, items } = ctx.data;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price_cents: Math.round(item.price * 100)
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return order;
  });
