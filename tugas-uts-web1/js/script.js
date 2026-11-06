function bukaModal(id) {
  document.getElementById(id).style.display = "flex";
}

function tutupModal(id) {
  document.getElementById(id).style.display = "none";
}

function angkaHarga(harga) {
  if (typeof harga === "number") return harga;

  return Number(String(harga).replace(/[^0-9]/g, ""));
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function ambilTransaksi() {
  return JSON.parse(localStorage.getItem("transaksi")) || [];
}

function simpanTransaksi(data) {
  localStorage.setItem("transaksi", JSON.stringify(data));
}


const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const akunTambahan = JSON.parse(localStorage.getItem("akunTambahan")) || [];

    const semuaPengguna = [...dataPengguna, ...akunTambahan];

    const pengguna = semuaPengguna.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (pengguna) {
      localStorage.setItem("userLogin", JSON.stringify(pengguna));

      alert("Login berhasil! Selamat datang " + pengguna.nama);

      window.location.href = "dashboard.html";
    } else {
      alert("email/password yang anda masukkan salah");
    }
  });
}


const formLupa = document.getElementById("formLupa");

if (formLupa) {
  formLupa.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailLupa").value;

    const akunTambahan = JSON.parse(localStorage.getItem("akunTambahan")) || [];

    const semuaPengguna = [...dataPengguna, ...akunTambahan];

    const pengguna = semuaPengguna.find(function (user) {
      return user.email === email;
    });

    if (pengguna) {
      alert(
        "Email ditemukan. Silakan hubungi admin untuk bantuan reset password.",
      );
    } else {
      alert("Email tidak terdaftar!");
    }

    tutupModal("modalLupa");
  });
}


const formDaftar = document.getElementById("formDaftar");

if (formDaftar) {
  formDaftar.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("namaDaftar").value;
    const email = document.getElementById("emailDaftar").value;
    const password = document.getElementById("passwordDaftar").value;

    const akunTambahan = JSON.parse(localStorage.getItem("akunTambahan")) || [];

    const semuaPengguna = [...dataPengguna, ...akunTambahan];

    const sudahAda = semuaPengguna.some(function (user) {
      return user.email === email;
    });

    if (sudahAda) {
      alert("Email sudah terdaftar!");
      return;
    }

    const penggunaBaru = {
      id: Date.now(),
      nama: nama,
      email: email,
      password: password,
      role: "User",
    };

    akunTambahan.push(penggunaBaru);

    localStorage.setItem("akunTambahan", JSON.stringify(akunTambahan));

    alert("Pendaftaran berhasil! Silakan login.");

    tutupModal("modalDaftar");
    formDaftar.reset();
  });
}


const greeting = document.getElementById("greeting");

if (greeting) {
  const jam = new Date().getHours();

  let ucapan;

  if (jam >= 4 && jam < 11) {
    ucapan = "Selamat Pagi";
  } else if (jam >= 11 && jam < 15) {
    ucapan = "Selamat Siang";
  } else if (jam >= 15 && jam < 18) {
    ucapan = "Selamat Sore";
  } else {
    ucapan = "Selamat Malam";
  }

  const user = JSON.parse(localStorage.getItem("userLogin"));

  greeting.innerText = ucapan + ", " + (user ? user.nama : "Pengunjung") + "!";

  const namaUser = document.getElementById("namaUser");

  if (namaUser && user) {
    namaUser.innerText = user.nama;
  }

  tampilkanLaporan();
}

function logout() {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.removeItem("userLogin");
    window.location.href = "index.html";
  }
}


function tampilkanStok() {
  const tabel = document.getElementById("tabelStok");

  if (!tabel) return;

  tabel.innerHTML = "";

  dataKatalogBuku.forEach(function (buku, index) {
    const baris = document.createElement("tr");

    const kolom = [
      index + 1,
      `<img src="${buku.cover}" class="book-cover" alt="Cover ${buku.namaBarang}">`,
      buku.kodeBarang,
      buku.namaBarang,
      buku.jenisBarang,
      buku.edisi,
      buku.stok,
      buku.harga,
    ];

    kolom.forEach(function (nilai) {
      const td = document.createElement("td");
      td.innerHTML = nilai;
      baris.appendChild(td);
    });

    tabel.appendChild(baris);
  });
}

tampilkanStok();


const formTambahBuku = document.getElementById("formTambahBuku");

if (formTambahBuku) {
  formTambahBuku.addEventListener("submit", function (e) {
    e.preventDefault();

    const kode = document.getElementById("kodeBarang").value;

    const sudahAda = dataKatalogBuku.some(function (buku) {
      return buku.kodeBarang === kode;
    });

    if (sudahAda) {
      alert("Kode barang sudah digunakan!");
      return;
    }

    const bukuBaru = {
      kodeBarang: kode,
      namaBarang: document.getElementById("namaBarang").value,
      jenisBarang: document.getElementById("jenisBarang").value,
      edisi: document.getElementById("edisi").value,
      stok: Number(document.getElementById("stok").value),
      harga: formatRupiah(Number(document.getElementById("harga").value)),
      cover: "img/pengantar_komunikasi.jpg",
    };

    dataKatalogBuku.push(bukuBaru);

    tampilkanStok();

    alert("Data buku berhasil ditambahkan!");

    formTambahBuku.reset();

    tutupModal("modalTambah");
  });
}


let keranjang = [];

function tampilkanPilihanBuku() {
  const select = document.getElementById("pilihBuku");

  if (!select) return;

  dataKatalogBuku.forEach(function (buku) {
    const option = document.createElement("option");

    option.value = buku.kodeBarang;
    option.textContent = buku.namaBarang + " - " + buku.harga;

    select.appendChild(option);
  });
}

tampilkanPilihanBuku();

function tambahPesanan() {
  const kode = document.getElementById("pilihBuku").value;

  const jumlah = Number(document.getElementById("jumlahBuku").value);

  const buku = dataKatalogBuku.find(function (item) {
    return item.kodeBarang === kode;
  });

  if (!buku) {
    alert("Silakan pilih buku terlebih dahulu!");
    return;
  }

  if (!Number.isInteger(jumlah) || jumlah < 1) {
    alert("Jumlah buku tidak valid!");
    return;
  }

  if (jumlah > buku.stok) {
    alert("Stok buku tidak mencukupi!");
    return;
  }

  const itemLama = keranjang.find(function (item) {
    return item.kodeBarang === kode;
  });

  if (itemLama) {
    if (itemLama.jumlah + jumlah > buku.stok) {
      alert("Jumlah melebihi stok tersedia!");
      return;
    }

    itemLama.jumlah += jumlah;
  } else {
    keranjang.push({
      kodeBarang: buku.kodeBarang,
      namaBarang: buku.namaBarang,
      harga: angkaHarga(buku.harga),
      jumlah: jumlah,
    });
  }

  tampilkanKeranjang();
}

function tampilkanKeranjang() {
  const tabel = document.getElementById("tabelKeranjang");

  if (!tabel) return;

  tabel.innerHTML = "";

  let total = 0;

  keranjang.forEach(function (item, index) {
    const subtotal = item.harga * item.jumlah;

    total += subtotal;

    const baris = document.createElement("tr");

    baris.innerHTML = `
            <td>${item.namaBarang}</td>
            <td>${formatRupiah(item.harga)}</td>
            <td>
                <input type="number"
                    min="1"
                    value="${item.jumlah}"
                    onchange="ubahJumlah(${index}, this.value)"
                    style="width:75px">
            </td>
            <td>${formatRupiah(subtotal)}</td>
            <td>
                <button class="btn-logout"
                    onclick="hapusPesanan(${index})">
                    Hapus
                </button>
            </td>
        `;

    tabel.appendChild(baris);
  });

  document.getElementById("totalHarga").innerText =
    "Total: " + formatRupiah(total);
}


function ubahJumlah(index, nilai) {
  const jumlah = Number(nilai);

  const item = keranjang[index];

  const buku = dataKatalogBuku.find(function (b) {
    return b.kodeBarang === item.kodeBarang;
  });

  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > buku.stok) {
    alert("Jumlah pesanan tidak valid!");

    tampilkanKeranjang();

    return;
  }

  item.jumlah = jumlah;

  tampilkanKeranjang();
}


function hapusPesanan(index) {
  keranjang.splice(index, 1);

  tampilkanKeranjang();
}



const formCheckout = document.getElementById("formCheckout");

if (formCheckout) {
  formCheckout.addEventListener("submit", function (e) {
    e.preventDefault();

    if (keranjang.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    const nama = document.getElementById("namaPemesan").value;
    const email = document.getElementById("emailPemesan").value;
    const telepon = document.getElementById("teleponPemesan").value;
    const alamat = document.getElementById("alamatPemesan").value;
    const metode = document.getElementById("metodePembayaran").value;

    // Periksa stok
    for (const item of keranjang) {
      const buku = dataKatalogBuku.find(function (b) {
        return b.kodeBarang === item.kodeBarang;
      });

      if (!buku || buku.stok < item.jumlah) {
        alert("Stok buku " + item.namaBarang + " tidak mencukupi!");
        return;
      }
    }

    const total = keranjang.reduce(function (sum, item) {
      return sum + item.harga * item.jumlah;
    }, 0);

    const nomorDO = String(Date.now()).slice(-8);

    const transaksiBaru = {
      nomorDO: nomorDO,
      nama: nama,
      email: email,
      telepon: telepon,
      alamat: alamat,
      buku: keranjang.map((item) => ({ ...item })),
      total: total,
      metode: metode,
      ekspedisi: "JNE",
      tanggalKirim: new Date().toISOString().slice(0, 10),
      status: "Pesanan Diproses",
    };

    keranjang.forEach(function (item) {
      const buku = dataKatalogBuku.find(function (b) {
        return b.kodeBarang === item.kodeBarang;
      });

      buku.stok -= item.jumlah;
    });

    const transaksi = ambilTransaksi();

    transaksi.push(transaksiBaru);

    simpanTransaksi(transaksi);

    alert("Pemesanan berhasil!\nNomor Delivery Order: " + nomorDO);

    keranjang = [];

    formCheckout.reset();

    tampilkanKeranjang();

    window.location.href = "tracking.html";
  });
}

function tampilkanLaporan() {
    const transaksi = ambilTransaksi();

    const dataContoh = Object.values(dataTracking).map(item => ({
        nomorDO: item.nomorDO,
        nama: item.nama,
        buku: [{
            namaBarang: item.nomorDO === "20230012"
                ? "Pengantar Ilmu Komunikasi"
                : "Manajemen Keuangan"
        }],
        total: angkaHarga(item.total)
    }));

    const semuaTransaksi = [...dataContoh, ...transaksi];

    const jumlah = document.getElementById("jumlahTransaksi");
    const pendapatan = document.getElementById("totalPendapatan");
    const tabel = document.getElementById("tabelHistory");

    if (!jumlah || !pendapatan || !tabel) return;

    jumlah.textContent = semuaTransaksi.length;

    const total = semuaTransaksi.reduce((sum, item) => {
        return sum + Number(item.total || 0);
    }, 0);

    pendapatan.textContent = "Rp " + total.toLocaleString("id-ID");

    tabel.innerHTML = "";

    if (semuaTransaksi.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="4">Belum ada transaksi.</td>
            </tr>
        `;
        return;
    }

    semuaTransaksi.forEach(item => {
        const baris = document.createElement("tr");

        const daftarBuku = Array.isArray(item.buku)
            ? item.buku.map(b => b.nama || b.judul || "Buku").join(", ")
            : "-";

        baris.innerHTML = `
            <td>${item.noDO || item.nomorDO || "-"}</td>
            <td>${item.nama || item.namaPemesan || "-"}</td>
            <td>${daftarBuku}</td>
            <td>Rp ${Number(item.total || 0).toLocaleString("id-ID")}</td>
        `;

        baris.style.cursor = "pointer";

        baris.onclick = function () {
            alert(
                "Detail Transaksi\n" +
                "Nomor DO: " + (item.noDO || item.nomorDO || "-") + "\n" +
                "Nama Pemesan: " + (item.nama || item.namaPemesan || "-") + "\n" +
                "Buku: " + daftarBuku + "\n" +
                "Total: Rp " + Number(item.total || 0).toLocaleString("id-ID")
            );
        };

        tabel.appendChild(baris);
    });
}


const formTracking = document.getElementById("formTracking");

if (formTracking) {
  formTracking.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomor = document.getElementById("nomorDO").value.trim();

    const hasil = document.getElementById("hasilTracking");

    let data = dataTracking[nomor];

    if (!data) {
      const transaksi = ambilTransaksi();

      data = transaksi.find(function (item) {
        return item.nomorDO === nomor;
      });
    }

    if (!data) {
      hasil.innerHTML = `
                <div class="tracking-info">
                    <h3>Data Tidak Ditemukan!</h3>
                    <p>Nomor Delivery Order tidak terdaftar.</p>
                </div>
            `;
      return;
    }

    const perjalanan = data.perjalanan || [];

    const progress =
      data.status === "Selesai"
        ? 100
        : data.status === "Dikirim"
          ? 70
          : data.status === "Dalam Perjalanan"
            ? 60
            : 25;

    const namaBuku = data.buku
      ? data.buku.map((b) => b.namaBarang + " (" + b.jumlah + ")").join(", ")
      : "-";

    const total =
      typeof data.total === "number" ? formatRupiah(data.total) : data.total;

    let riwayat = "";

    perjalanan.forEach(function (item) {
      riwayat += `
                <div class="timeline-item">
                    <strong>${item.waktu}</strong>
                    <p>${item.keterangan}</p>
                </div>
            `;
    });

    if (data.status === "Pesanan Diproses") {
      riwayat = `
                <div class="timeline-item">
                    <strong>Pesanan diterima</strong>
                    <p>Pesanan sedang diproses oleh toko.</p>
                </div>
            `;
    }

    hasil.innerHTML = `
            <div class="tracking-info">
                <h2>Informasi Pengiriman</h2>

                <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
                <p><strong>Nama Pemesan:</strong> ${data.nama}</p>
                <p><strong>Nama Buku:</strong> ${namaBuku}</p>
                <p><strong>Status:</strong>
                    <span class="status">${data.status}</span>
                </p>

                <div class="progress">
                    <div class="progress-bar"
                        style="width: ${progress}%">
                    </div>
                </div>

                <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
                <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
                <p><strong>Jenis Paket:</strong> ${data.paket || "Reguler"}</p>
                <p><strong>Total Pembayaran:</strong> ${total}</p>
            </div>

            <div class="content-card">
                <h2>Riwayat Perjalanan</h2>
                <div class="timeline">
                    ${riwayat}
                </div>
            </div>
        `;
  });
}
