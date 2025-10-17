// ============================================
// 🧠 HamidDev AI Image Generator — Client Script
// ============================================

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
    // إرسال الطلب إلى /api/generate
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    loader.style.display = "none";

    if (data.error) return alert(data.error);
    if (!data.data || !Array.isArray(data.data))
      return alert("Invalid response from server.");

    // عرض الصور الثلاثة
    data.data.forEach((base64, index) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.margin = "10px";

      const img = document.createElement("img");
      img.src = "data:image/png;base64," + base64;
      img.style.width = "220px";
      img.style.borderRadius = "14px";
      img.style.boxShadow = "0 0 25px #00f0ff55";
      img.style.maxWidth = "90vw"; // متجاوب مع الهاتف

      // زر التحميل
      const downloadBtn = document.createElement("button");
      downloadBtn.innerText = "Download";
      downloadBtn.style.position = "absolute";
      downloadBtn.style.bottom = "8px";
      downloadBtn.style.right = "8px";
      downloadBtn.style.padding = "6px 12px";
      downloadBtn.style.fontSize = "14px";
      downloadBtn.style.border = "none";
      downloadBtn.style.borderRadius = "8px";
      downloadBtn.style.background =
        "linear-gradient(90deg, #00eaff, #00ffff)";
      downloadBtn.style.color = "#00151e";
      downloadBtn.style.fontWeight = "bold";
      downloadBtn.style.cursor = "pointer";
      downloadBtn.style.transition = "opacity 0.3s ease";

      // إظهار الزر عند اللمس أو تمرير الماوس (للهواتف أيضًا)
      wrapper.addEventListener("mouseenter", () => {
        downloadBtn.style.opacity = "1";
      });
      wrapper.addEventListener("mouseleave", () => {
        downloadBtn.style.opacity = "1"; // يبقى ظاهر على الهواتف
      });

      // زر التحميل يعمل فور الضغط
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
