export interface requestData {
    success: Boolean,
    data: {
        announcements: Array<annoncementData>
    }
}

export interface annoncementData {
    id: number
    category_id: number
    user_id: number
    announcement_dispenser_id: number | null,
    title: string
    slug: string
    is_vip: number
    has_auto_delivery: number
    model: string
    type: string | null
    max_plan: number
    description: string
    unit_price: string
    sale_count: number
    item_sale_count: number
    stock_quantity: number
    date_created: string
    date_updated: string
    status: string
    announcement_type_id: number
    verified_authorship: number
    images: { id: number; announcement_id: number; is_cover: number; name: string; has_webp: number; date_updated: string; date_created: string; }[]
    items: { id: number; announcement_id: number; title: string; stock_quantity: number; unit_price: string; date_created: string; date_updated: string; status: string; }[]
    user: {
        id: number
        avatar: string | null
        has_webp: number
        identification: string | null
        username: string
        signature: string | null
        type: string
        theme: string
        is_vip: number
        date_last_access: string
        date_created: string
        date_updated: string
        status: string
        ban_reason: string | null
        summary?: { id: number; user_id: number; points: number; negative: number; total: number; neutral: number; positive: number; average_reply_time_in_minutes: number; }
    }
    in_wishlist: number
}