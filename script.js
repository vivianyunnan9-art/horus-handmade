const WHATSAPP_NUMBER = "201224001449";

let collectionsData = [];
let cart = [];
let currentCategory = "all";
let searchQuery = "";

const collectionsContainer = document.getElementById("collectionsContainer");
const collectionTabsContainer = document.getElementById("collectionTabs");
const searchInput = document.getElementById("searchInput");

// استخراج الاسم الأساسي للشنطة لتجميع الألوان المتشابهة في كارت واحد
function getBaseBagName(fullName) {
  let clean = fullName.replace(/\s*\([^)]*\)\s*$/g, "").trim();
  if (clean.includes("صدفة البحر")) {
    return "شنطة صدفة البحر ونجمة البحر";
  }
  if (clean.startsWith("توت ")) {
    return "توت آرت هاند ميد (أشكال متعددة)";
  }
  return clean;
}

// =========================================
// 1. تحميل الأقسام والشنط وتجميع المتشابه منها
// =========================================
async function loadStoreData() {
  collectionsContainer.innerHTML = `
    <div style="text-align:center; padding:50px; color:var(--brown-deep);">
      <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--terracotta); margin-bottom:10px;"></i>
      <p>جاري تحميل الكوليكشن...</p>
    </div>
  `;

  try {
    const [catRes, prodRes] = await Promise.all([
      supabaseClient.from("categories").select("*").order("sort_order", { ascending: true }),
      supabaseClient.from("products").select("*").order("created_at", { ascending: false })
    ]);

    if (catRes.error) throw catRes.error;
    if (prodRes.error) throw prodRes.error;

    const categories = catRes.data || [];
    const products = prodRes.data || [];

    collectionsData = categories.map((cat) => {
      const rawProducts = products.filter((p) => p.category_id === cat.id);
      const groupedMap = new Map();

      rawProducts.forEach((p) => {
        const baseName = getBaseBagName(p.name);
        const groupKey = `${baseName}_${p.price}`;
        const pImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : ["https://via.placeholder.com/300"];

        if (!groupedMap.has(groupKey)) {
          groupedMap.set(groupKey, {
            id: p.id,
            name: baseName,
            price: Number(p.price),
            colorsList: p.color ? [p.color] : [],
            badge: p.badge || "",
            inStock: p.in_stock,
            desc: p.description || "",
            images: [...pImages]
          });
        } else {
          const existing = groupedMap.get(groupKey);
          pImages.forEach((img) => {
            if (!existing.images.includes(img)) existing.images.push(img);
          });
          if (p.color && !existing.colorsList.includes(p.color)) {
            existing.colorsList.push(p.color);
          }
          if (p.in_stock) existing.inStock = true;
        }
      });

      const mergedProducts = Array.from(groupedMap.values()).map((item) => ({
        ...item,
        color: item.colorsList.join(" / ") || "ألوان متعددة"
      }));

      return {
        id: cat.slug,
        dbId: cat.id,
        title: cat.title,
        subtitle: cat.subtitle || "",
        products: mergedProducts
      };
    });

    renderTabs();
    renderCollections();
  } catch (err) {
    console.error("Error loading store data:", err);
    collectionsContainer.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--brown-deep);">
        <p>تعذر تحميل المنتجات حالياً، يرجى تحديث الصفحة.</p>
      </div>
    `;
  }
}

// =========================================
// 2. رسم أزرار الأقسام
// =========================================
function renderTabs() {
  collectionTabsContainer.innerHTML = `<button class="tab-btn ${currentCategory === "all" ? "active" : ""}" data-category="all">الكل</button>`;
  collectionsData.forEach((col) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${currentCategory === col.id ? "active" : ""}`;
    btn.dataset.category = col.id;
    btn.textContent = col.title;
    collectionTabsContainer.appendChild(btn);
  });

  collectionTabsContainer.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderTabs();
      renderCollections();
    });
  });
}

// =========================================
// 3. عرض الكروت المجمعة + السلايدر والنقط
// =========================================
function renderCollections() {
  collectionsContainer.innerHTML = "";

  collectionsData.forEach((collection) => {
    if (currentCategory !== "all" && collection.id !== currentCategory) return;

    const q = searchQuery.trim().toLowerCase();
    const filteredProducts = collection.products.filter((product) => {
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.color.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q) ||
        collection.title.toLowerCase().includes(q)
      );
    });

    if (filteredProducts.length === 0) return;

    const block = document.createElement("section");
    block.className = "collection-block";

    block.innerHTML = `
      <div class="collection-title-bar">
        <h3>${collection.title}</h3>
        <span class="collection-subtitle">${collection.subtitle}</span>
      </div>
      <div class="products-grid-fixed">
        ${filteredProducts
          .map((p) => {
            const imagesHTML = p.images
              .map(
                (imgUrl) =>
                  `<img src="${imgUrl}" alt="${p.name}" loading="lazy" onclick="openQuickView('${p.id}')" />`
              )
              .join("");

            const dotsHTML = `<div class="slider-dots" id="dots-${p.id}">
              ${p.images
                .map(
                  (_, idx) =>
                    `<span class="${idx === 0 ? "active" : ""}" onclick="goToSlide('${p.id}', ${idx})"></span>`
                )
                .join("")}
            </div>`;

            const waText = encodeURIComponent(
              `أهلاً Horus handmade ❤️، حابة أطلب شنطة:\n• الموديل: ${p.name}\n• السعر: ${p.price} ج.م`
            );

            return `
              <article class="product-card">
                <div class="product-img-wrap">
                  <div class="card-slider-container" id="slider-${p.id}" onscroll="updateDots('${p.id}', this)">
                    ${imagesHTML}
                  </div>
                  ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
                  ${!p.inStock ? `<span class="stock-badge-out">نفدت الكمية</span>` : ""}
                </div>
                ${dotsHTML}
                <div class="product-info">
                  <h4 class="product-name" title="${p.name}">${p.name}</h4>
                  <span class="product-color-text" title="${p.color}">${p.color}</span>
                  <div class="product-price">${p.price} ج.م</div>
                  <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart('${p.id}')" ${!p.inStock ? "disabled" : ""}>
                      ${p.inStock ? "أضيفي للسلة" : "غير متاح"}
                    </button>
                    <a class="btn-wa-mini" href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" target="_blank" aria-label="طلب واتساب">
                      <i class="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;

    collectionsContainer.appendChild(block);
  });

  if (collectionsContainer.innerHTML === "") {
    collectionsContainer.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--text-muted);">
        لا توجد شنط مطابقة لبحثك حالياً.
      </div>
    `;
  }
}

function updateDots(productId, sliderEl) {
  const dotsContainer = document.getElementById(`dots-${productId}`);
  if (!dotsContainer) return;

  const index = Math.round(sliderEl.scrollLeft / sliderEl.clientWidth);
  const dots = dotsContainer.querySelectorAll("span");

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

function goToSlide(productId, index) {
  const sliderEl = document.getElementById(`slider-${productId}`);
  if (!sliderEl) return;
  sliderEl.scrollTo({
    left: index * sliderEl.clientWidth,
    behavior: "smooth"
  });
}

function findProductById(id) {
  for (const col of collectionsData) {
    const found = col.products.find((p) => String(p.id) === String(id));
    if (found) return found;
  }
  return null;
}

// =========================================
// 4. المعاينة السريعة (إظهار الصورة كاملة بدون قص)
// =========================================
const quickViewModal = document.getElementById("quickViewModal");
const quickViewContent = document.getElementById("quickViewContent");

function openQuickView(productId) {
  const p = findProductById(productId);
  if (!p) return;

  const thumbsHTML = p.images
    .map(
      (img, i) =>
        `<img src="${img}" style="width:56px; height:64px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${
          i === 0 ? "var(--brown-deep)" : "transparent"
        };" onclick="document.getElementById('qvMainImg').src='${img}'" />`
    )
    .join("");

  quickViewContent.innerHTML = `
    <img id="qvMainImg" src="${p.images[0]}" alt="${p.name}" style="width:100%; max-height:360px; object-fit:contain; background:#efe7dc; border-radius:12px; margin:10px 0;" />
    ${p.images.length > 1 ? `<div style="display:flex; gap:8px; overflow-x:auto; margin-bottom:12px;">${thumbsHTML}</div>` : ""}
    <h3 style="color:var(--brown-deep); font-size:1.2rem;">${p.name}</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin:4px 0;">${p.color}</p>
    <p style="font-size:0.9rem; margin:8px 0;">${p.desc}</p>
    <div style="font-size:1.15rem; font-weight:800; color:var(--brown-deep); margin:10px 0;">${p.price} ج.م</div>
    <button class="btn-checkout-wa" onclick="addToCart('${p.id}'); closeQuickViewModal();" ${!p.inStock ? "disabled" : ""}>
      ${p.inStock ? "أضيفي للسلة" : "نفدت الكمية"}
    </button>
  `;
  quickViewModal.classList.add("open");
}

function openImageLightbox(imgSrc) {
  quickViewContent.innerHTML = `
    <img src="${imgSrc}" alt="رأي عميلة" style="width:100%; border-radius:12px; margin-top:10px;" />
  `;
  quickViewModal.classList.add("open");
}

function closeQuickViewModal() {
  quickViewModal.classList.remove("open");
}

document.getElementById("closeQuickView").addEventListener("click", closeQuickViewModal);
quickViewModal.addEventListener("click", (e) => {
  if (e.target === quickViewModal) closeQuickViewModal();
});

// =========================================
// 5. السلة والواتساب
// =========================================
function addToCart(productId) {
  const product = findProductById(productId);
  if (!product || !product.inStock) return;

  const existing = cart.find((item) => String(item.id) === String(productId));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  openCartDrawer();
}

function changeQty(productId, delta) {
  const index = cart.findIndex((item) => String(item.id) === String(productId));
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById("cartBadge").textContent = totalCount;
  document.getElementById("mobileCartBadge").textContent = totalCount;
  document.getElementById("cartTotal").textContent = `${totalPrice} ج.م`;

  const container = document.getElementById("cartItemsContainer");
  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:30px 0;">سلة المشتريات فارغة حالياً</p>`;
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item-row">
        <img src="${item.images[0]}" alt="${item.name}" />
        <div style="flex:1;">
          <h4 style="font-size:0.88rem; color:var(--brown-deep);">${item.name}</h4>
          <span style="font-size:0.8rem; color:var(--text-muted);">${item.price} ج.م × ${item.qty}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button onclick="changeQty('${item.id}', -1)" style="width:24px; height:24px; border-radius:6px; border:1px solid var(--border-soft); cursor:pointer;">-</button>
          <span style="font-weight:700; font-size:0.85rem;">${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)" style="width:24px; height:24px; border-radius:6px; border:1px solid var(--border-soft); cursor:pointer;">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCartDrawer() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

document.getElementById("openCartBtn").addEventListener("click", openCartDrawer);
document.getElementById("mobileCartBtn").addEventListener("click", openCartDrawer);
document.getElementById("closeCartBtn").addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

document.getElementById("checkoutWaBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("السلة فارغة! أضيفي شنطة أولاً.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !address) {
    alert("من فضلك اكتبي الاسم والعنوان لإتمام الطلب.");
    return;
  }

  const itemsText = cart
    .map((item, idx) => `${idx + 1}. ${item.name} (الكمية: ${item.qty}) - ${item.price * item.qty} ج.م`)
    .join("\n");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message = `أهلاً Horus Handmade ❤️، طلب جديد من الموقع:\n\n👤 الاسم: ${name}\n📍 العنوان: ${address}\n\n🛍️ الطلبات:\n${itemsText}\n\n💰 الإجمالي: ${totalPrice} ج.م`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderCollections();
});

document.getElementById("openSearchFocus").addEventListener("click", () => {
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  searchInput.focus();
});

document.getElementById("mobileSearchBtn").addEventListener("click", () => {
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  searchInput.focus();
});

updateCartUI();
loadStoreData();