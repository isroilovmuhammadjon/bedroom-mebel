# Buyurtma serveri: Cloudflare Workers (bepul)

Saytdagi buyurtmalar shu kichik dastur orqali Telegram botga, u yerdan do'kon chatiga keladi. Cloudflare'ning bepul tarifi kuniga 100 000 so'rovgacha yetadi, kompyuter yoqib qo'yish shart emas.

## O'rnatish (taxminan 10 daqiqa)

1. https://dash.cloudflare.com/sign-up sahifasida bepul akkaunt oching.
2. Chap menyuda **Workers & Pages** → **Create** → **Create Worker** (Hello World). Nomini `bedroom-orders` qiling va **Deploy** bosing.
3. **Edit code** bosing, ichidagi hamma kodni o'chirib, shu papkadagi `worker.js` faylining butun matnini joylang va **Deploy** bosing.
4. Worker sahifasida **Settings → Variables and Secrets** bo'limiga kiring va qo'shing:
   - `BOT_TOKEN`: botning tokeni (@BotFather beradi). Turi: **Secret**.
   - `CHAT_IDS`: buyurtma boradigan chat raqamlari, vergul bilan, masalan `111111111,222222222`. Turi: **Text**.
   - Agar sayt o'z domeningizga ko'chsa: `ALLOWED_ORIGINS` = `https://bedroommebel.uz` (bir nechta bo'lsa, vergul bilan).
5. Worker manzilini nusxalang (masalan `https://bedroom-orders.<ism>.workers.dev`) va Claude'ga yuboring. U saytdagi `BRAND.api` ni shu manzilga o'zgartiradi.

Har bir odam botga bir marta **Start** bosgan bo'lishi kerak, aks holda bot unga yoza olmaydi. Chat raqamini @userinfobot ko'rsatadi.

## Tekshirish

Saytdan bitta sinov buyurtma yuboring: bir necha soniyada Telegram'ga kelishi kerak. Brauzerda worker manzilini ochsangiz, `{"ok":true,...}` chiqadi.

## Himoya

- Faqat sizning saytingizdan kelgan so'rovlar qabul qilinadi.
- Bitta IP manzildan 10 daqiqada 5 tadan ortiq buyurtma yuborib bo'lmaydi.
- Bot tokeni saytda emas, faqat Cloudflare'da saqlanadi.
