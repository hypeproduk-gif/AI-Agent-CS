import express from "express";
import multer from "multer";
import { fal } from "@fal-ai/client";

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error("Set FAL_KEY dulu"); process.exit(1); }
fal.config({ credentials: FAL_KEY });

const IMAGE_MODEL = process.env.IMAGE_MODEL || "fal-ai/nano-banana/edit";
const MOTION_MODEL = process.env.MOTION_MODEL || "fal-ai/kling-video/v2.6/standard/motion-control";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
app.use(express.static("public"));
app.use(express.json());

const jobs = new Map(); // id -> {status, step, composite, video, error}

async function toUrl(file) {
  const blob = new Blob([file.buffer], { type: file.mimetype });
  return fal.storage.upload(new File([blob], file.originalname, { type: file.mimetype }));
}

async function run(id, files, opts) {
  const job = jobs.get(id);
  try {
    job.step = "Upload file...";
    const videoUrl = await toUrl(files.video[0]);
    const modelUrl = await toUrl(files.model[0]);
    const productUrls = await Promise.all((files.products || []).map(toUrl));

    let imageUrl = modelUrl;
    if (productUrls.length) {
      job.step = "Memakaikan produk ke model (AI image)...";
      const prompt = opts.imagePrompt ||
        "Image 1 is the model. The other images are products (fashion/accessories/items). " +
        "Make the same model from image 1 wear or hold all the products naturally, full body, same face, " +
        "same identity, product details/colors/logo exactly preserved, clean photorealistic photo, neutral background.";
      const r = await fal.subscribe(IMAGE_MODEL, {
        input: { prompt, image_urls: [modelUrl, ...productUrls], num_images: 1 },
      });
      imageUrl = r.data.images[0].url;
      job.composite = imageUrl;
    }

    job.step = "Membuat video motion control (bisa 2-10 menit)...";
    const r = await fal.subscribe(MOTION_MODEL, {
      input: {
        image_url: imageUrl,
        video_url: videoUrl,
        prompt: opts.videoPrompt || "",
        character_orientation: opts.orientation || "video",
        keep_original_sound: opts.keepSound !== "false",
      },
      logs: true,
      onQueueUpdate: (u) => { if (u.status === "IN_QUEUE") job.step = `Antri (posisi ${u.queue_position ?? "-"})...`; },
    });
    job.video = r.data.video?.url;
    job.status = "done";
    job.step = "Selesai";
  } catch (e) {
    job.status = "error";
    job.error = e.body ? JSON.stringify(e.body) : String(e.message || e);
  }
}

app.post("/api/generate",
  upload.fields([{ name: "video", maxCount: 1 }, { name: "model", maxCount: 1 }, { name: "products", maxCount: 5 }]),
  (req, res) => {
    if (!req.files?.video || !req.files?.model) return res.status(400).json({ error: "Video dan foto model wajib" });
    const id = crypto.randomUUID();
    jobs.set(id, { status: "running", step: "Mulai..." });
    run(id, req.files, req.body);
    res.json({ id });
  });

app.get("/api/jobs/:id", (req, res) => {
  const j = jobs.get(req.params.id);
  j ? res.json(j) : res.status(404).json({ error: "not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Motion Control jalan di http://localhost:${port}`));
