const btn = document.getElementById("genBtn");
const inp = document.getElementById("inp");
const loader = document.getElementById("loader");
const imagesBox = document.getElementById("images");

btn.addEventListener("click", async () => {
  const prompt = inp.value.trim();
  if (!prompt) return alert("Please describe your idea first!");

  loader.style.display = "block";
  imagesBox.innerHTML = "";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    loader.style.display = "none";

    if (data.error) {
      alert(data.error);
      return;
    }

    const images = data.data || [data.image];
    if (!images || !images.length) {
      alert("No image returned from AI. Try again.");
      return;
    }

    images.forEach((base64, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "image-card";

      const img = document.createElement("img");
      img.src = "data:image/png;base64," + base64;

      const downloadBtn = document.createElement("button");
      downloadBtn.innerText = "Download";
      downloadBtn.className = "download-btn";

      // زر التحميل دائم على الجوال
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        downloadBtn.style.opacity = "1";
      } else {
        wrapper.addEventListener("mouseenter", () => (downloadBtn.style.opacity = "1"));
        wrapper.addEventListener("mouseleave", () => (downloadBtn.style.opacity = "0"));
      }

      downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = `ai_image_${Date.now()}_${index + 1}.png`;
        a.click();
      });

      wrapper.appendChild(img);
      wrapper.appendChild(downloadBtn);
      imagesBox.appendChild(wrapper);
    });
  } catch (err) {
    loader.style.display = "none";
    alert("Error generating image.");
    console.error(err);
  }
});
