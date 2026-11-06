"""Shopee Affiliate Open API (GraphQL): link affiliate ber-Sub ID + info produk."""
import hashlib, json, os, re, time

import requests

URL = "https://open-api.affiliate.shopee.co.id/graphql"


def enabled() -> bool:
    return bool(os.getenv("SHOPEE_APP_ID") and os.getenv("SHOPEE_APP_SECRET"))


def gql(query: str, variables: dict | None = None) -> dict:
    app_id, secret = os.environ["SHOPEE_APP_ID"], os.environ["SHOPEE_APP_SECRET"]
    payload = json.dumps({"query": query, "variables": variables or {}}, separators=(",", ":"))
    ts = str(int(time.time()))
    sig = hashlib.sha256(f"{app_id}{ts}{payload}{secret}".encode()).hexdigest()
    r = requests.post(URL, data=payload, timeout=30, headers={
        "Content-Type": "application/json",
        "Authorization": f"SHA256 Credential={app_id}, Timestamp={ts}, Signature={sig}"})
    r.raise_for_status()
    data = r.json()
    if data.get("errors"):
        raise RuntimeError(f"Shopee API: {data['errors'][0].get('message')}")
    return data["data"]


def short_link(origin_url: str, sub_id: str) -> str:
    q = """mutation($u:String!,$s:[String]){generateShortLink(input:{originUrl:$u,subIds:$s}){shortLink}}"""
    return gql(q, {"u": origin_url, "s": [sub_id]})["generateShortLink"]["shortLink"]


def links_per_platform(origin_url: str, platforms=("fb", "ig", "threads")) -> dict:
    return {p: short_link(origin_url, p) for p in platforms}


def parse_ids(url: str):
    m = re.search(r"i\.(\d+)\.(\d+)", url) or re.search(r"/product/(\d+)/(\d+)", url)
    return (int(m.group(1)), int(m.group(2))) if m else (None, None)


def product_info(url: str) -> str:
    """Ringkasan harga/rating/terjual/komisi untuk bahan caption; '' bila tidak ketemu."""
    shop_id, item_id = parse_ids(url)
    if not item_id:
        return ""
    q = """query($s:Int64,$i:Int64){productOfferV2(shopId:$s,itemId:$i,limit:1){nodes{
        productName priceMin priceMax commissionRate sales ratingStar shopName}}}"""
    nodes = gql(q, {"s": shop_id, "i": item_id})["productOfferV2"]["nodes"]
    if not nodes:
        return ""
    n = nodes[0]
    price = f"Rp{int(float(n['priceMin'])):,}".replace(",", ".")
    return (f"Nama di Shopee: {n['productName']}. Harga mulai {price}. "
            f"Terjual {n.get('sales')}. Rating {n.get('ratingStar')}. Toko {n.get('shopName')}. "
            f"(Komisi {float(n['commissionRate']) * 100:.1f}% - jangan tulis komisi di caption)")
