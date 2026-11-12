const WHATSAPP_NUMBER = "201128863731";

const collectionsData = [
  {
    id: "queens",
    title: "كوليكشن ملكات مصر (Royal Queens)",
    subtitle: "إصدار ملكي مستوحى من رموز القوة والجمال في مصر القديمة",
    products: [
      {
        id: "q1",
        name: "شنطة حتشبسوت - الطموح",
        price: 750,
        color: "أسود × ألوان ملكية",
        badge: "إصدار ملكي",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.43 PM (1).jpeg",
        desc: "شنطة توت واسعة ومنسوجة يدوياً باللون الأسود الفخم مع شريط جانبي ملون يعكس القوة والعملية."
      },
      {
        id: "q2",
        name: "شنطة نفرتيتي - الجمال الكامل",
        price: 680,
        color: "كحلي لامع",
        badge: "الأكثر طلباً",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.43 PM (2).jpeg",
        desc: "تصميم شبكي أنيق باللون الكحلي بلمعة خفيفة تخطف الأنظار في الخروجات والمناسبات."
      },
      {
        id: "q3",
        name: "شنطة إيزيس - الحكمة والقوة",
        price: 780,
        color: "زيتي ملكي",
        badge: "هاند ميد 100%",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.43 PM (3).jpeg",
        desc: "شنطة دائرية بغرزة الماندالا البارزة مع يد جلد سوداء وشراشيب يدوية باللون الأبيض والأخضر."
      },
      {
        id: "q4",
        name: "شنطة هاتحور - الفرح والحب",
        price: 760,
        color: "ذهبي دافئ",
        badge: "إصدار خاص",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.46 PM (1).jpeg",
        desc: "تصميم صدفي فاخر باللون الذهبي الدافئ مع يد دائرية أنيقة تعبر عن البهجة والأناقة."
      }
    ]
  },
  {
    id: "coastal",
    title: "لمسة بحرية (Coastal Grace Collection)",
    subtitle: "تصميمات الصدفة ونجمة البحر لأجمل إطلالات الصيف والشاطئ",
    products: [
      {
        id: "c1",
        name: "شنطة صدفة البحر ونجمة البحر (ملونة)",
        price: 650,
        color: "ألوان صيفية متداخلة",
        badge: "صيف 2026",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.49 PM.jpeg",
        desc: "تصميم صدفي مميز مع نجمة بحر كروشيه ويد سلسلة عصرية لإطلالة صيفية مبهجة."
      },
      {
        id: "c2",
        name: "شنطة صدفة البحر (ذهبي غروب)",
        price: 650,
        color: "ذهبي × أصفر",
        badge: "جديد",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.48 PM.jpeg",
        desc: "مستوحاة من ألوان الغروب على البحر مع نجمة بحر متناسقة ويد سلسلة أنيقة."
      },
      {
        id: "c3",
        name: "شنطة صدفة البحر (أوف وايت × كريز)",
        price: 650,
        color: "أوف وايت × بني",
        badge: "مميز",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.46 PM (2).jpeg",
        desc: "لون هادئ وراقي مع نجمة بحر بنية وخرز كريزي يضيف لمسة أنثوية ناعمة."
      },
      {
        id: "c4",
        name: "شنطة صدفة البحر (برتقالي تيراكوتا)",
        price: 650,
        color: "تيراكوتا دافئ",
        badge: "صيف 2026",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.47 PM (2).jpeg",
        desc: "درجة البرتقالي المحروق الحيوية مع نجمة بحر من نفس اللون ويد سلسلة فخمة."
      },
      {
        id: "c5",
        name: "شنطة صدفة البحر (رمادي دافئ)",
        price: 650,
        color: "رمادي × برتقالي",
        badge: "شيك",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.47 PM.jpeg",
        desc: "تباين أنيق بين الرمادي الهادي ونجمة البحر البرتقالية لإطلالة مختلفة."
      },
      {
        id: "c6",
        name: "شنطة الصدفة الدائرية بشراشيب (بيج)",
        price: 690,
        color: "بيج رملي",
        badge: "الأكثر مبيعاً",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM (3).jpeg",
        desc: "شنطة دائرية بفتحة V أنيقة، مزودة بحزام جلد طويل وشراشيب يدوية متناسقة."
      },
      {
        id: "c7",
        name: "شنطة الصدفة الدائرية بشراشيب (نبيتي)",
        price: 690,
        color: "نبيتي برغندي",
        badge: "فخم",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM.jpeg",
        desc: "اللون النبيتي الغني مع يد جلد بنية وشراشيب يدوية تضفي فخامة على إطلالتك."
      },
      {
        id: "c8",
        name: "شنطة الصدفة الملونة (Vibrant Tones)",
        price: 720,
        color: "ألوان مبهجة",
        badge: "قطعة فنية",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM (2).jpeg",
        desc: "مزيج ألوان متناغم ومنسوج يدوياً بدقة عالية مع حزام جلد بيج."
      }
    ]
  },
  {
    id: "tote",
    title: "كوليكشن توت آرت (Art Totes Collection)",
    subtitle: "شنط توت مربعة بتطريز يدوي بارز وحزام كروس منقوش",
    products: [
      {
        id: "t1",
        name: "توت صدفة اللؤلؤ (لبني سماوي)",
        price: 740,
        color: "لبني سماوي",
        badge: "تصميم حصري",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.44 PM.jpeg",
        desc: "شنطة توت عملية بتطريز صدفة ولؤلؤة بارزة وحزام كروس قابل للتعديل."
      },
      {
        id: "t2",
        name: "توت الفراشة الملكية (كحلي)",
        price: 740,
        color: "كحلي غامق",
        badge: "الأكثر طلباً",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.46 PM.jpeg",
        desc: "تطريز فراشة بألوان باستيل ناعمة على خلفية كحلي مع حزام كروس مزخرف."
      },
      {
        id: "t3",
        name: "توت فاشونيستا بوب آرت (فسدقي)",
        price: 740,
        color: "أخضر فسدقي",
        badge: "عصري",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.45 PM (1).jpeg",
        desc: "تصميم شبابي مبهج باللون الفسدقي مع تطريز يدوي بارز وحزام عريض مريح."
      },
      {
        id: "t4",
        name: "توت عين حورس والصدفة (بيج)",
        price: 750,
        color: "بيج طبيعي",
        badge: "هوية حورس",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.47 PM (1).jpeg",
        desc: "تجمع بين رمز عين حورس وألوان الصدفة الدافئة مع حزام منقوش أنيق."
      },
      {
        id: "t5",
        name: "توت لعبة XO بالقلوب (جملي)",
        price: 720,
        color: "جملي دافئ",
        badge: "مرح وأنيق",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.35 PM (1).jpeg".replace("35 PM", "46 PM"),
        desc: "تصميم XO المميز بالقلوب الحمراء المنسوجة يدوياً مع حزام كروس مزخرف."
      }
    ]
  },
  {
    id: "boho",
    title: "بوهو شيك وباكيت باج (Boho-Chic & Tiye)",
    subtitle: "أناقة بوهيمية راقية بأيادي خشب وقلوب منسوجة بحب",
    products: [
      {
        id: "b1",
        name: "Tiye Bucket Bag (قلوب منسوجة)",
        price: 620,
        color: "بيج / أسود / جملي",
        badge: "متوفر 3 ألوان",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.51 PM.jpeg",
        desc: "شنطة باكيت ببطانة داخلية ورباط غلق مزينة بقلوب منسوجة وحزام كروس مجدول."
      },
      {
        id: "b2",
        name: "Elevated Boho-Chic (مخططة بيد خشب)",
        price: 680,
        color: "ألوان بوهو متعددة",
        badge: "شياكة الصيف",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.50 PM (3).jpeg",
        desc: "شنطة صيفية مخططة بألوان دافئة مع يد خشب دائرية وشراشيب جانبية."
      },
      {
        id: "b3",
        name: "شنطة الشاطئ المخططة (أسود × جملي)",
        price: 670,
        color: "أسود × جملي",
        badge: "كلاسيك",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.51 PM (2).jpeg",
        desc: "تصميم نصف دائري واسع بيد خشبية دائرية مثالي للبحر والخروجات الصباحية."
      },
      {
        id: "b4",
        name: "شنطة بوهيمية دائرية بالخرز والشراشيب",
        price: 640,
        color: "بيج / كحلي",
        badge: "بوهو ستايل",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM (5).jpeg",
        desc: "شنطة كروس دائرية مزينة بخرز ملون وشراشيب سفلية لإطلالة صيفية مميزة."
      },
      {
        id: "b5",
        name: "شنطة ماندالا الدائرية (جملي)",
        price: 780,
        color: "جملي × شراشيب",
        badge: "الأكثر طلباً",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.53 PM (3).jpeg",
        desc: "غرزة ماندالا دقيقة باللون الجملي مع يد جلد بنية وشراشيب صفراء وحمراء."
      }
    ]
  },
  {
    id: "classic",
    title: "كلاسيك وميني كروس (Classic & Everyday)",
    subtitle: "شنط عملية وخفيفة لكل يوم ولكل المناسبات",
    products: [
      {
        id: "cl1",
        name: "شنطة بوكس كلاسيك (سلسلة وقفل معدني)",
        price: 660,
        color: "5 ألوان متاحة",
        badge: "عملي وأنيق",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.53 PM (1).jpeg",
        desc: "شنطة بوكس متماسكة بقفل معدني وإيد علوية وسلسلة كروس (متوفرة بالأخضر، البيج، الموف، الكحلي، والبني)."
      },
      {
        id: "cl2",
        name: "كلاتش مود (أحمر قرمزي / مستردة)",
        price: 590,
        color: "قرمزي / مستردة",
        badge: "Colors Define Mood",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.51 PM (3).jpeg",
        desc: "تصميم ناعم وعصري بيد مدمجة وشعار Horus المعدني."
      },
      {
        id: "cl3",
        name: "كلاتش تايملس (أسود / جملي)",
        price: 590,
        color: "أسود / جملي",
        badge: "أساسي في دولابك",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.53 PM.jpeg",
        desc: "شنطة كلاتش واسعة وخفيفة تناسب الخروجات السريعة والمناسبات."
      },
      {
        id: "cl4",
        name: "سبيشال إيديشن كلاتش (تطريز زهرة)",
        price: 640,
        color: "كحلي / بيج / أسود",
        badge: "Special Edition",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM (4).jpeg",
        desc: "تصميم هندسي مميز بخيوط فاخرة وتفاصيل يدوية دقيقة."
      },
      {
        id: "cl5",
        name: "شنطة شبكية صيفية (أخضر زرعي)",
        price: 480,
        color: "أخضر زرعي",
        badge: "خفيفة وعملية",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.54 PM (1).jpeg",
        desc: "شنطة كتف شبكية واسعة وخفيفة الوزن مثالية للنادي والجامعة والشاطئ."
      },
      {
        id: "cl6",
        name: "شنطة شبكية بلمعة (أسود)",
        price: 490,
        color: "أسود لامع",
        badge: "شيك",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.54 PM.jpeg",
        desc: "نفس التصميم الشبكي المريح بخيط أسود بلمعة خفيفة تناسب كل الأوقات."
      },
      {
        id: "cl7",
        name: "ميني كروس للموبايل والأساسيات",
        price: 380,
        color: "ألوان متعددة",
        badge: "سعر مميز",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.52 PM (6).jpeg",
        desc: "شنطة كروس صغيرة بوحدة جيراني ملونة لحمل الموبايل والمفاتيح بسهولة."
      },
      {
        id: "cl8",
        name: "كروس بوهو زجزاج بالشراشيب",
        price: 460,
        color: "أزرق / أسود / بيج",
        badge: "ألوان الصيف",
        image: "images/WhatsApp Image 2026-11-11 at 11.35.42 PM (1).jpeg",
        desc: "شنطة كروس منسوجة بنقشة الزجزاج الملونة وشراشيب جانبية."
      }
    ]
  }
];

let cart = [];
let currentCategory = "all";
let searchQuery = "";

const collectionsContainer = document.getElementById("collectionsContainer");
const searchInput = document.getElementById("searchInput");
const tabBtns = document.querySelectorAll(".tab-btn");

// Render Collections & Products
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
          <div class="product-card">
            <div class="product-img-wrap" onclick="openQuickView('${p.id}')">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
              <span class="product-badge">${p.badge}</span>
              <button class="quick-view-btn" title="معاينة سريعة"><i class="fas fa-eye"></i></button>
            </div>
            <div class="product-info">
              <h4>${p.name}</h4>
              <p class="product-desc">${p.desc}</p>
              <div class="product-meta">
                <span class="product-price">${p.price} ج.م</span>
                <span class="product-color">${p.color}</span>
              </div>
              <div class="product-actions">
                <button class="btn-cart" onclick="addToCart('${p.id}')">
                  <i class="fas fa-plus"></i> أضيفي للسلة
                </button>
                <a class="btn-wa-direct" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `أهلاً Horus handmade ❤️، حابة أطلب شنطة:\n- الموديل: ${p.name}\n- اللون: ${p.color}\n- السعر: ${p.price} ج.م`
                )}" target="_blank">
                  <i class="fab fa-whatsapp"></i> اطلبي الآن
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

// Helper to find product by ID
function findProductById(id) {
  for (const col of collectionsData) {
    const found = col.products.find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}

// Filter Tabs
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderCollections();
  });
});

function filterByCategory(cat) {
  currentCategory = cat;
  tabBtns.forEach((b) => {
    b.classList.toggle("active", b.dataset.category === cat);
  });
  renderCollections();
  document.getElementById("collections").scrollIntoView({ behavior: "smooth" });
}

// Search Input
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderCollections();
});

// Quick View Modal
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");

function openQuickView(id) {
  const p = findProductById(id);
  if (!p) return;

  modalBody.innerHTML = `
    <img src="${p.image}" alt="${p.name}" />
    <div class="modal-details">
      <span class="hero-badge" style="width:fit-content;">${p.badge}</span>
      <h3 style="font-size:1.5rem; color:var(--brown-dark); margin-bottom:10px;">${p.name}</h3>
      <p style="color:var(--text-muted); margin-bottom:15px;">${p.desc}</p>
      <p style="margin-bottom:8px;"><strong>اللون:</strong> ${p.color}</p>
      <p style="font-size:1.4rem; font-weight:800; color:var(--crimson); margin-bottom:20px;">${p.price} ج.م</p>
      <div style="display:flex; gap:10px; flex-direction:column;">
        <button class="btn btn-primary" onclick="addToCart('${p.id}'); closeModal();">
          <i class="fas fa-shopping-bag"></i> إضافة إلى سلة الطلبات
        </button>
        <a class="btn btn-wa-direct" style="padding:12px; border-radius:30px;" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          `أهلاً Horus handmade ❤️، حابة أطلب شنطة:\n- الموديل: ${p.name}\n- السعر: ${p.price} ج.م`
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
  if (!product) return;

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
    if (name) msg += `- الاسم: ${name}\n`;
    if (gov) msg += `- المحافظة: ${gov}\n`;
    if (address) msg += `- العنوان: ${address}\n`;
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

// Initial Render
renderCollections();