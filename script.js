const WHATSAPP_NUMBER = "201224001449";

let collectionsData = [];
let cart = [];
let currentCategory = "all";
let searchQuery = "";

const collectionsContainer = document.getElementById("collectionsContainer");
const collectionTabsContainer = document.getElementById("collectionTabs");
const searchInput = document.getElementById("searchInput");

// جلب الأقسام والمنتجات من Supabase عند فتح الموقع
async function loadStoreData() {
  collectionsContainer.innerHTML = `
    <div style="text-align:center; padding:50px; color:var(--brown-mid);">
      <i class="fas fa-spinner fa-spin fa-2x" style="color:var(--crimson); margin-bottom:10px;"></i>
      <p>جاري تحميل الكوليكشنز...</p>
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

    // ربط المنتجات بكل قسم بنفس الهيكل الأصلي
    collectionsData = categories.map((cat) => ({
      id: cat.slug,
      dbId: cat.id,
      title: cat.title,
      subtitle: cat.subtitle || "",
      products: products
        .filter((p) => p.category_id === cat.id)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          color: p.color || "",
          badge: p.badge || "",
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ["images/WhatsApp Image 2026-11-12 at 11.09.28 AM.jpeg"],
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "images/WhatsApp Image 2026-11-12 at 11.09.28 AM.jpeg",
          desc: p.description || "",
          inStock: p.in_stock !== false
        }))
    }));

    renderCategoryTabs();
    renderCollections();
  } catch (err) {
    console.error("Error loading store data:", err);
    collectionsContainer.innerHTML = `
      <p style="text-align:center; padding:40px; color:var(--crimson);">
        حدث خطأ أثناء تحميل المنتجات. يرجى تحديث الصفحة.
      </p>
    `;
  }
}

// توليد أزرار الأقسام ديناميكياً
function renderCategoryTabs() {
  if (!collectionTabsContainer) return;

  let tabsHTML = `<button class="tab-btn ${currentCategory === "all" ? "active" : ""}" data-category="all">الكل</button>`;
  collectionsData.forEach((col) => {
    tabsHTML += `<button class="tab-btn ${currentCategory === col.id ? "active" : ""}" data-category="${col.id}">${col.title}</button>`;
  });

  collectionTabsContainer.innerHTML = tabsHTML;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderCollections();
    });
  });
}

// عرض الأقسام والمنتجات بنفس التصميم الأصلي
function renderCollections() {
  collectionsContainer.innerHTML = "";

  collectionsData.forEach((collection) => {
    if (currentCategory !== "all" && collection.id !== currentCategory) return;

    const filteredProducts = collection.products.filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.color.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q) ||
        collection.title.toLowerCase().includes(q)
      );
    });

    if (filteredProducts.length === 0) return;

    const block = document.createElement("div");
    block.className = "collection-block";

    block.innerHTML = `
      <div class="collection-title-bar">
        <h3>${collection.title}</h3>
        <span class="collection-subtitle">${collection.subtitle}</span>
      </div>
      <div class="products-grid">
        ${filteredProducts
          .map(
            (p) => `
          <div class="product-card ${!p.inStock ? "out-of-stock" : ""}">
            <div class="product-img-wrap" onclick="openQuickView('${p.id}')">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
              ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
              ${!p.inStock ? `<span class="stock-badge-out">نفدت الكمية</span>` : ""}
              <button class="quick-view-btn" title="معاينة سريعة"><i class="fas fa-eye"></i></button>
            </div>
            <div class="product-info">
              <h4>${p.name}</h4>
              <p class="product-desc">${p.desc}</p>
              <div class="product-meta">
                <span class="product-price">${p.price} ج.م</span>
                ${p.color ? `<span class="product-color">${p.color}</span>` : ""}
              </div>
              <div class="product-actions">
                <button class="btn-cart" onclick="addToCart('${p.id}')" ${!p.inStock ? "disabled" : ""}>
                  <i class="fas fa-plus"></i> ${p.inStock ? "أضيفي للسلة" : "غير متاح"}
                </button>
                <a class="btn-wa-direct" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  p.inStock
                    ? `أهلاً Horus handmade ❤️، حابة أطلب شنطة:\nالموديل: ${p.name}\nاللون: ${p.color}\nالسعر: ${p.price} ج.م`
                    : `أهلاً Horus handmade ❤️، حابة أستفسر عن إمكانية تنفيذ شنطة (${p.name}) بالطلب`
                )}" target="_blank">
                  <i class="fab fa-whatsapp"></i> ${p.inStock ? "اطلبي الآن" : "اطلبي تنفيذها"}
                </a>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    collectionsContainer.appendChild(block);
  });

  if (collectionsContainer.innerHTML === "") {
    collectionsContainer.innerHTML = `<p style="text-align:center; padding:40px; color:#6e5d53;">لا توجد شنط مطابقة لبحثك.. جربي كلمة أخرى!</p>`;
  }
}

function findProductById(id) {
  for (const col of collectionsData) {
    const found = col.products.find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}

function filterByCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.category === cat);
  });
  renderCollections();
  document.getElementById("collections").scrollIntoView({ behavior: "smooth" });
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderCollections();
});

// Quick View Modal مع دعم الصور المتعددة
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

function switchModalImage(src, thumbEl) {
  const mainImg = document.getElementById("modalMainImage");
  if (mainImg) mainImg.src = src;
  document.querySelectorAll(".modal-thumbs img").forEach((el) => el.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
}

function openQuickView(id) {
  const p = findProductById(id);
  if (!p) return;

  const thumbsHTML =
    p.images.length > 1
      ? `<div class="modal-thumbs">
          ${p.images
            .map(
              (imgUrl, idx) =>
                `<img src="${imgUrl}" class="${idx === 0 ? "active" : ""}" onclick="switchModalImage('${imgUrl}', this)" alt="صورة ${idx + 1}" />`
            )
            .join("")}
        </div>`
      : "";

  modalBody.innerHTML = `
    <div class="modal-img-col">
      <img id="modalMainImage" src="${p.image}" alt="${p.name}" />
      ${thumbsHTML}
    </div>
    <div class="modal-details">
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        ${p.badge ? `<span class="hero-badge" style="margin:0;">${p.badge}</span>` : ""}
        <span class="hero-badge" style="margin:0; background:${p.inStock ? "rgba(37, 211, 102, 0.15)" : "rgba(43, 29, 20, 0.1)"}; color:${p.inStock ? "#15803d" : "#2b1d14"};">
          ${p.inStock ? "متوفر حالياً" : "نفدت الكمية (متاح تنفيذ بالطلب)"}
        </span>
      </div>
      <h3 style="font-size:1.5rem; color:var(--brown-dark); margin-bottom:10px;">${p.name}</h3>
      <p style="color:var(--text-muted); margin-bottom:15px;">${p.desc}</p>
      ${p.color ? `<p style="margin-bottom:8px;"><strong>اللون:</strong> ${p.color}</p>` : ""}
      <p style="font-size:1.4rem; font-weight:800; color:var(--crimson); margin-bottom:20px;">${p.price} ج.م</p>
      <div style="display:flex; gap:10px; flex-direction:column;">
        ${
          p.inStock
            ? `<button class="btn btn-primary" onclick="addToCart('${p.id}'); closeModal();">
                <i class="fas fa-shopping-bag"></i> إضافة إلى سلة الطلبات
              </button>`
            : ""
        }
        <a class="btn btn-wa-direct" style="padding:12px; border-radius:30px;" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          `أهلاً Horus handmade ❤️، حابة أطلب شنطة:\nالموديل: ${p.name}\nالسعر: ${p.price} ج.م`
        )}" target="_blank">
          <i class="fab fa-whatsapp"></i> طلب مباشر عبر واتساب
        </a>
      </div>
    </div>
  `;
  productModal.classList.add("active");
}

function closeModal() {
  productModal.classList.remove("active");
}

closeModalBtn.addEventListener("click", closeModal);
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) closeModal();
});

// Cart Functions
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");

function toggleCart(open) {
  cartDrawer.classList.toggle("active", open);
  cartOverlay.classList.toggle("active", open);
}

openCartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

function addToCart(id) {
  const product = findProductById(id);
  if (!product || !product.inStock) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  toggleCart(true);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = `${totalPrice} ج.م`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart-msg">السلة فارغة حالياً.. اختاري شنطتك المفضلة!</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <span>${item.price} ج.م × ${item.qty}</span>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')" title="حذف">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `
    )
    .join("");
}

// WhatsApp Checkout
document.getElementById("checkoutWaBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("من فضلك أضيفي شنطة واحدة على الأقل للسلة أولاً!");
    return;
  }

  const name = document.getElementById("custName").value.trim();
  const gov = document.getElementById("custGov").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  let msg = `أهلاً Horus handmade ❤️، حابة أعمل أوردر جديد:\n\n`;
  cart.forEach((item, index) => {
    msg += `${index + 1}. ${item.name} (الكمية: ${item.qty}) — ${item.price * item.qty} ج.م\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  msg += `\n*الإجمالي:* ${total} ج.م\n`;

  if (name || gov || address) {
    msg += `\n*بيانات الشحن:*\n`;
    if (name) msg += `الاسم: ${name}\n`;
    if (gov) msg += `المحافظة: ${gov}\n`;
    if (address) msg += `العنوان: ${address}\n`;
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
});

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Start App
loadStoreData();