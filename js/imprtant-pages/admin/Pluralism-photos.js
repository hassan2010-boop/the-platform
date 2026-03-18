(function(){
  const defaultPhoto = { images: {}, tables: { first: "", second: "", third: "" } };
  let cur = localStorage.getItem("photo");
  if (!cur) {
    localStorage.setItem("photo", JSON.stringify(defaultPhoto));
  }
})();

function normalizeKey(name) {
  if (!name) return "";
  name = String(name).trim();
  if (/^[0-9]\s*/.test(name)) return name.replace(/^[0-9]\s*/, "").trim();
  return name;
}

function gradeKeyFromPrefix(prefixOrName) {
  if (!prefixOrName && prefixOrName !== 0) return null;
  let s = String(prefixOrName).trim();
  if (/^[1]/.test(s)) return "first";
  if (/^[2]/.test(s)) return "second";
  if (/^[3]/.test(s)) return "third";
  let fromSession = sessionStorage.getItem("namephoto");
  if (fromSession === "1") return "first";
  if (fromSession === "2") return "second";
  if (fromSession === "3") return "third";
  return null;
}

function getTbodyByGrade(grade) {
  return document.querySelector(`tbody[data-grade='${grade}']`);
}

function readPhotoData() {
  return JSON.parse(localStorage.getItem("photo") || '{"images":{},"tables":{"first":"","second":"","third":""}}');
}

function writePhotoData(data) {
  localStorage.setItem("photo", JSON.stringify(data));
}

function createRowElement(displayName) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>?</td>
    <td><button class="group-button" data-name="${escapeHtml(displayName)}">${escapeHtml(displayName)}</button></td>
    <td><button class="download-button"><i class="fas fa-download"></i></button></td>
    <td><button class="removal" style="color: #ff4d4d; border: none; background: none; cursor: pointer; font-size: 1.2rem;">
        <i class="fas fa-trash-alt"></i>
    </button></td>
  `;
  return tr;
}

function escapeHtml(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function reindexTable(tbody) {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.forEach((r, i) => {
    const cell = r.children[0];
    if (cell) cell.textContent = i + 1;
  });
}

function loadTables() {
  const photoData = readPhotoData();
  ['first','second','third'].forEach(g => {
    const tbody = getTbodyByGrade(g);
    if (!tbody) return;
    tbody.innerHTML = photoData.tables && photoData.tables[g] ? photoData.tables[g] : "";
    
    // تصحيح الأيقونات في البيانات القديمة المحملة
    tbody.querySelectorAll('.removal').forEach(btn => {
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.style.cssText = "color: #ff4d4d; border: none; background: none; cursor: pointer; font-size: 1.2rem;";
    });
    tbody.querySelectorAll('.download-button').forEach(btn => {
        btn.innerHTML = '<i class="fas fa-download"></i>';
    });

    reindexTable(tbody);
  });
  updateGroupCount();
}

function saveTables() {
  const data = readPhotoData();
  data.tables = data.tables || { first: "", second: "", third: "" };
  ['first','second','third'].forEach(g => {
    const tbody = getTbodyByGrade(g);
    data.tables[g] = tbody ? tbody.innerHTML : "";
  });
  writePhotoData(data);
}

function removeRow(button) {
  const row = button.closest('tr');
  if (!row) return;
  const tbody = row.parentElement;
  const groupBtn = row.querySelector('.group-button');
  const name = groupBtn ? groupBtn.getAttribute('data-name') : null;
  row.remove();
  reindexTable(tbody);

  if (name) {
    const data = readPhotoData();
    if (data.images && data.images[name]) delete data.images[name];
    data.tables = data.tables || {};
    ['first','second','third'].forEach(g=>{
      const tb = getTbodyByGrade(g);
      if (tb) data.tables[g] = tb.innerHTML;
    });
    writePhotoData(data);
  }
  updateGroupCount();
}

function downloadImageByGroupName(groupName) {
  const data = readPhotoData();
  const img = data.images && data.images[groupName];
  if (!img) {
    alert("No image found for this group.");
    return;
  }
  const link = document.createElement('a');
  link.href = img;
  link.download = `${groupName}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function updateGroupCount(){
  const total = document.querySelectorAll("tbody tr").length;
  const el = document.getElementById("group-count");
  if (el) el.textContent = total;
}

function countTotalStudentsAndSubscribers(){
  let totalStudents = 0, totalSubscribers = 0;
  for (let i=0;i<localStorage.length;i++){
    const key = localStorage.key(i);
    if (key && key.includes("Students")) {
      try {
        const arr = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(arr)) {
          totalStudents += arr.length;
          arr.forEach(s => { if (s.subscribed) totalSubscribers++; });
        }
      } catch(e){}
    }
  }
  const sEl = document.getElementById("student-count");
  const suEl = document.getElementById("subscriber-count");
  if (sEl) sEl.textContent = totalStudents;
  if (suEl) suEl.textContent = totalSubscribers;
}

document.addEventListener("click", function(e){
  const t = e.target;
  
  const removalBtn = t.closest('.removal');
  if (removalBtn) {
    removeRow(removalBtn);
    saveTables();
    countTotalStudentsAndSubscribers();
  }

  const groupBtn = t.closest('.group-button');
  if (groupBtn) {
    const name = groupBtn.getAttribute('data-name');
    sessionStorage.setItem('groupName2', name);
    const data = readPhotoData();
    if (data.images && data.images[name]) {
      sessionStorage.setItem('uploadedImage', data.images[name]);
    }
    const tbody = groupBtn.closest('tbody');
    if (tbody) sessionStorage.setItem('tablename1', tbody.getAttribute('data-grade'));
  }

  const downloadBtn = t.closest('.download-button');
  if (downloadBtn) {
    const row = downloadBtn.closest('tr');
    if (row) {
      const gb = row.querySelector('.group-button');
      if (gb) downloadImageByGroupName(gb.getAttribute('data-name'));
    }
  }
});

document.addEventListener("DOMContentLoaded", function(){
  loadTables();
  countTotalStudentsAndSubscribers();

  document.querySelectorAll(".add-row").forEach((btn, idx)=>{
    btn.addEventListener("click", function(){
      sessionStorage.setItem("namephoto", String(idx+1));
      window.location.href = "create-group/settings.html";
    });
  });
});