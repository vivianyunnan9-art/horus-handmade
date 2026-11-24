let categories = [];
let products = [];
let currentProductImages = [];

const PRESET_BADGES = [
  "",
  "الأكثر طلباً",
  "جديد",
  "قطعة مميزة",
  "إصدار محدود",
  "ترشيحنا"
];

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function toggleCustomBadgeInput(prefillValue = "") {
  const selectEl = document.getElementById("prodBadgeSelect");
  const customEl = document.getElementById("prodBadgeCustom");
  if (selectEl.value === "custom") {
    customEl.style.display = "block";
    customEl.value = prefillValue;
    customEl.required = true;
  } else {
    customEl.style.display = "none";
    customEl.value = "";
    customEl.required = false;
  }
}

function setBadgeFormValue(badgeValue) {
  const selectEl = document.getElementById("prodBadgeSelect");
  const cleanVal = (badgeValue || "").trim();
  if (PRESET_BADGES.includes(cleanVal)) {
    selectEl.value = cleanVal;
    toggleCustomBadgeInput("");
  } else {
    selectEl.value = "custom";
    toggleCustomBadgeInput(cleanVal);
  }
}

function getBadgeFormValue() {
  const selectEl = document.getElementById("prodBadgeSelect");
  if (selectEl.value === "custom") {
    return document.getElementById("prodBadgeCustom").value.trim();
  }
  return selectEl.value.trim();
}

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    await loadAdminData();
  } else {
    loginSection.style.display = "flex";
    dashboardSection.style.display = "none";
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الدخول...`;

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> تسجيل الدخول`;

  if (error) {
    loginError.textContent = "بيانات الدخول غير صحيحة، تأكدي من البريد وكلمة المرور.";
    return;
  }

  checkAuth();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  checkAuth();
});

async function loadAdminData() {
  const [catRes, prodRes] = await Promise.all([
    supabaseClient.from("categories").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false })
  ]);

  categories = catRes.data || [];
  products = (prodRes.data || []).map((p, idx) => ({
    ...p,
    sort_order: typeof p.sort_order === "number" && p.sort_order > 0 ? p.sort_order : idx + 1
  }));

  updateStats();
  populateCategorySelects();
  renderAdminProducts();
  renderAdminCategories();
}

function updateStats() {
  document.getElementById("totalProductsCount").textContent = products.length;
  document.getElementById("totalCategoriesCount").textContent = categories.length;
  document.getElementById("inStockCount").textContent = products.filter((p) => p.in_stock).length;
}

function populateCategorySelects() {
  const filterSelect = document.getElementById("adminCategoryFilter");
  const prodSelect = document.getElementById("prodCategory");

  filterSelect.innerHTML = `<option value="all">كل الأقسام (${products.length})</option>`;
  prodSelect.innerHTML = "";

  categories.forEach((cat) => {
    const count = products.filter((p) => p.category_id === cat.id).length;
    filterSelect.innerHTML += `<option value="${cat.id}">${cat.title} (${count})</option>`;
    prodSelect.innerHTML += `<option value="${cat.id}">${cat.title}</option>`;
  });
}

// تحريك شنطة لأعلى أو لأسفل في القائمة وحفظ الترتيب في Supabase
async function moveProduct(productId, direction) {
  const currentIndex = products.findIndex((p) => String(p.id) === String(productId));
  if (currentIndex === -1) return;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= products.length) return;

  const temp = products[currentIndex];
  products[currentIndex] = products[targetIndex];
  products[targetIndex] = temp;

  renderAdminProducts();

  try {
    await Promise.all(
      products.map((item, idx) =>
        supabaseClient.from("products").update({ sort_order: idx + 1 }).eq("id", item.id)
      )
    );
    products.forEach((item, idx) => {
      item.sort_order = idx + 1;
    });
    showToast("تم تحديث ترتيب الشنط ✅");
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء حفظ الترتيب: " + err.message);
    await loadAdminData();
  }
}

function renderAdminProducts() {
  const grid = document.getElementById("adminProductsGrid");
  const query = document.getElementById("adminSearchInput").value.trim().toLowerCase();
  const catFilter = document.getElementById("adminCategoryFilter").value;
  const canReorder = !query && catFilter === "all";

  const filtered = products.filter((p) => {
    const matchCat = catFilter === "all" || p.category_id === catFilter;
    const matchSearch = !query || p.name.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted); padding:20px;">لا توجد شنط مطابقة.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map((p, index) => {
      const cat = categories.find((c) => c.id === p.category_id);
      const thumb = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "";
      const isFirst = index === 0;
      const isLast = index === filtered.length - 1;

      const orderControls = canReorder
        ? `
          <div class="order-arrows" style="display:flex; gap:6px; margin-bottom:8px;">
            <button type="button" class="btn-order" onclick="moveProduct('${p.id}', 'up')" ${isFirst ? "disabled" : ""} title="تحريك للأعلى" style="padding:4px 10px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer;">▲ للأعلى</button>
            <button type="button" class="btn-order" onclick="moveProduct('${p.id}', 'down')" ${isLast ? "disabled" : ""} title="تحريك للأسفل" style="padding:4px 10px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer;">▼ للأسفل</button>
          </div>
        `
        : "";

      return `
        <div class="admin-prod-card">
          <div class="admin-prod-img">
            <img src="${thumb}" alt="${p.name}" />
            <span class="stock-pill ${p.in_stock ? "in" : "out"}">
              ${p.in_stock ? "متاح" : "نفدت الكمية"}
            </span>
          </div>
          <div class="admin-prod-body">
            ${orderControls}
            <span class="admin-prod-cat">${cat ? cat.title : "بدون قسم"}</span>
            <h4>${p.name}</h4>
            ${p.badge ? `<span class="admin-prod-badge" style="display:inline-block; font-size:0.78rem; padding:2px 8px; border-radius:12px; background:#f3ece2; margin-bottom:6px;">${p.badge}</span>` : ""}
            <div class="admin-prod-price">${p.price} ج.م</div>
            <div class="admin-card-actions">
              <button class="btn-edit" onclick="openEditProduct('${p.id}')">
                <i class="fas fa-edit"></i> تعديل
              </button>
              <button class="btn-delete" onclick="deleteProduct('${p.id}', '${p.name.replace(/'/g, "")}')">
                <i class="fas fa-trash"></i> حذف
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

document.getElementById("adminSearchInput").addEventListener("input", renderAdminProducts);
document.getElementById("adminCategoryFilter").addEventListener("change", renderAdminProducts);

document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ================= إدارة المنتجات =================
const productFormModal = document.getElementById("productFormModal");

document.getElementById("openAddProductBtn").addEventListener("click", () => {
  document.getElementById("productModalTitle").textContent = "إضافة شنطة جديدة";
  document.getElementById("productForm").reset();
  document.getElementById("editProductId").value = "";
  setBadgeFormValue("");
  currentProductImages = [];
  renderImagePreviews();
  productFormModal.classList.add("active");
});

function openEditProduct(id) {
  const p = products.find((item) => item.id === id);
  if (!p) return;

  document.getElementById("productModalTitle").textContent = "تعديل بيانات الشنطة";
  document.getElementById("editProductId").value = p.id;
  document.getElementById("prodName").value = p.name;
  document.getElementById("prodCategory").value = p.category_id;
  document.getElementById("prodPrice").value = p.price;
  setBadgeFormValue(p.badge || "");
  document.getElementById("prodStock").value = p.in_stock ? "true" : "false";
  document.getElementById("prodDesc").value = p.description || "";
  document.getElementById("prodImagesInput").value = "";

  currentProductImages = Array.isArray(p.images) ? [...p.images] : [];
  renderImagePreviews();
  productFormModal.classList.add("active");
}

function closeProductModal() {
  productFormModal.classList.remove("active");
}

// نقل صورة إلى رقم ترتيب محدد (1، 2، 3...)
function moveImageToPosition(fromIndex, targetPos) {
  const parsed = Number(targetPos);
  if (isNaN(parsed)) return;
  const newIndex = Math.max(0, Math.min(currentProductImages.length - 1, parsed - 1));
  if (fromIndex === newIndex) {
    renderImagePreviews();
    return;
  }

  const [movedImg] = currentProductImages.splice(fromIndex, 1);
  currentProductImages.splice(newIndex, 0, movedImg);
  renderImagePreviews();
  showToast(`تم نقل الصورة إلى الترتيب رقم ${newIndex + 1} ✅`);
}

// تبديل صورة مع الصورة السابقة أو التالية
function swapProductImage(index, direction) {
  const targetIndex = direction === "prev" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= currentProductImages.length) return;

  const temp = currentProductImages[index];
  currentProductImages[index] = currentProductImages[targetIndex];
  currentProductImages[targetIndex] = temp;

  renderImagePreviews();
  showToast("تم تبديل ترتيب الصور ✅");
}

function renderImagePreviews() {
  const container = document.getElementById("existingImagesPreview");
  container.innerHTML = currentProductImages
    .map(
      (url, idx) => `
      <div class="preview-thumb" style="position:relative;">
        <img src="${url}" alt="صورة" />
        <button type="button" onclick="removeExistingImage(${idx})" title="حذف الصورة">×</button>
        <div style="display:flex; gap:4px; justify-content:center; align-items:center; margin-top:4px; flex-wrap:wrap;">
          <label style="font-size:0.7rem; font-weight:700;">ترتيب:</label>
          <input
            type="number"
            min="1"
            max="${currentProductImages.length}"
            value="${idx + 1}"
            onchange="moveImageToPosition(${idx}, this.value)"
            style="width:42px; padding:2px 4px; border-radius:5px; border:1px solid #bbb; text-align:center; font-size:0.75rem;"
          />
          <button
            type="button"
            onclick="swapProductImage(${idx}, 'prev')"
            ${idx === 0 ? "disabled" : ""}
            title="تحريك لليسار / للأمام"
            style="padding:2px 7px; border-radius:5px; border:1px solid #ccc; background:#fff; cursor:pointer; font-size:0.75rem;"
          >←</button>
          <button
            type="button"
            onclick="swapProductImage(${idx}, 'next')"
            ${idx === currentProductImages.length - 1 ? "disabled" : ""}
            title="تحريك لليمين / للخلف"
            style="padding:2px 7px; border-radius:5px; border:1px solid #ccc; background:#fff; cursor:pointer; font-size:0.75rem;"
          >→</button>
        </div>
      </div>
    `
    )
    .join("");
}

function removeExistingImage(index) {
  currentProductImages.splice(index, 1);
  renderImagePreviews();
}

async function uploadNewImages(files) {
  const uploadedUrls = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabaseClient.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabaseClient.storage
      .from("product-images")
      .getPublicUrl(fileName);

    uploadedUrls.push(publicUrlData.publicUrl);
  }
  return uploadedUrls;
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const saveBtn = document.getElementById("saveProductBtn");
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...`;

  try {
    const filesInput = document.getElementById("prodImagesInput");
    let newUrls = [];
    if (filesInput.files.length > 0) {
      newUrls = await uploadNewImages(filesInput.files);
    }

    const finalImages = [...currentProductImages, ...newUrls];
    if (finalImages.length === 0) {
      alert("من فضلك اختاري صورة واحدة على الأقل للشنطة.");
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fas fa-save"></i> حفظ الشنطة`;
      return;
    }

    const editId = document.getElementById("editProductId").value;
    const existingProd = editId ? products.find((item) => String(item.id) === String(editId)) : null;

    const payload = {
      name: document.getElementById("prodName").value.trim(),
      category_id: document.getElementById("prodCategory").value,
      price: Number(document.getElementById("prodPrice").value),
      badge: getBadgeFormValue(),
      in_stock: document.getElementById("prodStock").value === "true",
      description: document.getElementById("prodDesc").value.trim(),
      images: finalImages,
      sort_order: existingProd ? existingProd.sort_order : 0
    };

    if (editId) {
      const { error } = await supabaseClient.from("products").update(payload).eq("id", editId);
      if (error) throw error;
      showToast("تم تعديل الشنطة بنجاح ✅");
    } else {
      const { error } = await supabaseClient.from("products").insert([payload]);
      if (error) throw error;
      showToast("تمت إضافة الشنطة الجديدة بنجاح ✅");
    }

    closeProductModal();
    await loadAdminData();
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء الحفظ: " + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<i class="fas fa-save"></i> حفظ الشنطة`;
  }
});

async function deleteProduct(id, name) {
  if (!confirm(`هل أنتِ متأكدة من حذف "${name}" نهائياً؟`)) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    alert("حدث خطأ أثناء الحذف: " + error.message);
    return;
  }
  showToast("تم حذف الشنطة بنجاح 🗑️");
  await loadAdminData();
}

// ================= إدارة الأقسام وترتيبها =================
async function moveCategory(catId, direction) {
  const currentIndex = categories.findIndex((c) => String(c.id) === String(catId));
  if (currentIndex === -1) return;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= categories.length) return;

  const temp = categories[currentIndex];
  categories[currentIndex] = categories[targetIndex];
  categories[targetIndex] = temp;

  renderAdminCategories();
  populateCategorySelects();

  try {
    await Promise.all(
      categories.map((cat, idx) =>
        supabaseClient.from("categories").update({ sort_order: idx + 1 }).eq("id", cat.id)
      )
    );
    categories.forEach((cat, idx) => {
      cat.sort_order = idx + 1;
    });
    showToast("تم تحديث ترتيب الكوليكشنز ✅");
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء حفظ ترتيب الأقسام: " + err.message);
    await loadAdminData();
  }
}

function renderAdminCategories() {
  const list = document.getElementById("adminCategoriesList");
  list.innerHTML = categories
    .map((cat, index) => {
      const count = products.filter((p) => p.category_id === cat.id).length;
      const isFirst = index === 0;
      const isLast = index === categories.length - 1;

      return `
        <div class="cat-item-card">
          <div class="cat-item-info">
            <h4>${index + 1}. ${cat.title} <span style="color:var(--crimson); font-size:0.85rem;">(${count} شنطة)</span></h4>
            <p>${cat.subtitle || "بدون وصف"}</p>
          </div>
          <div class="cat-item-actions" style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <button type="button" class="btn-order" onclick="moveCategory('${cat.id}', 'up')" ${isFirst ? "disabled" : ""} title="تحريك للأعلى" style="padding:6px 10px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer;">▲</button>
            <button type="button" class="btn-order" onclick="moveCategory('${cat.id}', 'down')" ${isLast ? "disabled" : ""} title="تحريك للأسفل" style="padding:6px 10px; border-radius:6px; border:1px solid #ddd; background:#fff; cursor:pointer;">▼</button>
            <button class="btn-edit" onclick="openEditCategory('${cat.id}')">
              <i class="fas fa-edit"></i> تعديل
            </button>
            <button class="btn-delete" onclick="deleteCategory('${cat.id}', '${cat.title.replace(/'/g, "")}', ${count})">
              <i class="fas fa-trash"></i> حذف
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

const categoryFormModal = document.getElementById("categoryFormModal");

document.getElementById("openAddCategoryBtn").addEventListener("click", () => {
  document.getElementById("categoryModalTitle").textContent = "إضافة قسم جديد";
  document.getElementById("categoryForm").reset();
  document.getElementById("editCategoryId").value = "";
  document.getElementById("catOrder").value = categories.length + 1;
  categoryFormModal.classList.add("active");
});

function openEditCategory(id) {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return;
  document.getElementById("categoryModalTitle").textContent = "تعديل القسم";
  document.getElementById("editCategoryId").value = cat.id;
  document.getElementById("catTitle").value = cat.title;
  document.getElementById("catSubtitle").value = cat.subtitle || "";
  document.getElementById("catOrder").value = cat.sort_order || 1;
  categoryFormModal.classList.add("active");
}

function closeCategoryModal() {
  categoryFormModal.classList.remove("active");
}

document.getElementById("categoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("catTitle").value.trim();
  const subtitle = document.getElementById("catSubtitle").value.trim();
  const sort_order = Number(document.getElementById("catOrder").value) || 1;
  const editId = document.getElementById("editCategoryId").value;

  if (editId) {
    const { error } = await supabaseClient
      .from("categories")
      .update({ title, subtitle, sort_order })
      .eq("id", editId);
    if (error) return alert(error.message);
    showToast("تم تعديل القسم بنجاح ✅");
  } else {
    const slug = "cat-" + Date.now();
    const { error } = await supabaseClient
      .from("categories")
      .insert([{ slug, title, subtitle, sort_order }]);
    if (error) return alert(error.message);
    showToast("تمت إضافة القسم بنجاح ✅");
  }

  closeCategoryModal();
  await loadAdminData();
});

async function deleteCategory(id, title, count) {
  const warning =
    count > 0
      ? `تحذير: هذا القسم يحتوي على (${count}) شنط، وحذفه سيحذف جميع الشنط بداخله! هل أنتِ متأكدة؟`
      : `هل أنتِ متأكدة من حذف قسم "${title}"؟`;

  if (!confirm(warning)) return;

  const { error } = await supabaseClient.from("categories").delete().eq("id", id);
  if (error) return alert(error.message);
  showToast("تم حذف القسم بنجاح 🗑️");
  await loadAdminData();
}

checkAuth();