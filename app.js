//! Arayüz elementlerin seçilmesi
const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');

const form = document.getElementById('form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');

//! Tüm kişileri tutan dizinin oluşturulması
const tumKisilerDizisi = [];
let secilenSatir = undefined;

//! Event listener'ların tanımlanması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

//! Event fonktion'ların yazılması
function kaydet(e) {
    e.preventDefault();

    const eklenecekVeyaGuncellenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value,
    };

    const sonuc = verileriKontrolEt(eklenecekVeyaGuncellenecekKisi);
    if (sonuc.durum) {
        if (secilenSatir) {
            kisiyiGuncelle(eklenecekVeyaGuncellenecekKisi);
        } else {
            kisiyiEkle(eklenecekVeyaGuncellenecekKisi);
        }
    } else {
        bilgiOlustur(sonuc.mesaj, sonuc.durum);
    }
}

function kisiIslemleriniYap(event) {
    if (event.target.classList.contains('btn--delete')) {
        const silinecekTr = event.target.parentElement.parentElement;
        const silinecekMail = event.target.parentElement.previousElementSibling.textContent;
        kisiyiSil(silinecekTr, silinecekMail);
    } else if (event.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydet-guncelle').value = 'Güncelle';
        const secilenTr = event.target.parentElement.parentElement;
        const guncellenecekMail = secilenTr.cells[2].textContent;
        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;
        console.log(tumKisilerDizisi);
    }
}

function verileriKontrolEt(kisi) {
    //1.yontem
    for (const deger in kisi) {
        if (kisi[deger]) {
            console.log(kisi[deger]);
        } else {
            return {
                durum: false,
                mesaj: 'Boş alan bırakmayınız',
            };
        }
    }
    alanlariTemizle();
    return {
        durum: true,
        mesaj: 'Kaydedildi',
    };
}

function bilgiOlustur(mesaj, durum) {
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    // if (durum) {
    //     olusturulanBilgi.classList.add('bilgi--success');
    // } else {
    //     olusturulanBilgi.classList.add('bilgi--error');
    // }
    olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');

    document.querySelector('.container').insertBefore(olusturulanBilgi, form);

    //& setTimeOut, setInterval
    setTimeout(() => {
        const silinecekDiv = document.querySelector('.bilgi');
        if (silinecekDiv) {
            silinecekDiv.remove();
        }
    }, 2000);
}

function alanlariTemizle() {
    ad.value = '';
    soyad.value = '';
    mail.value = '';
}

function kisiyiEkle(eklenecekKisi) {
    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `
        <td>${eklenecekKisi.ad}</td>
        <td>${eklenecekKisi.soyad}</td>
        <td>${eklenecekKisi.mail}</td>
        <td>
            <button class="btn btn--edit">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="btn btn--delete">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </td>
    `;
    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekKisi);
    bilgiOlustur('Kişi rehbere kaydedildi', true);
}

function kisiyiSil(silinecekTrElement, silinecekMail) {
    console.log(silinecekTrElement, silinecekMail);

    // //maile göre silme işlemi
    // tumKisilerDizisi.forEach((kisi, index) => {
    //     if (kisi.mail === silinecekMail) {
    //         tumKisilerDizisi.splice(index, 1);
    //     }
    // });
    silinecekTrElement.remove();

    //2.yöntem
    const silinmeyecekKisiler = tumKisilerDizisi.filter(function (kisi, index) {
        return kisi.mail !== silinecekMail;
    });

    tumKisilerDizisi.length = 0;
    tumKisilerDizisi.push(...silinmeyecekKisiler);

    alanlariTemizle();
    document.querySelector('.kaydet-guncelle').value = 'Kaydet';
}

function kisiyiGuncelle(kisi) {
    //kisi parametresinde seçilen kişinin yeni değerleri vardır
    //secilen satırda da güncellenmemiş değerler var

    for (let i = 0; i < tumKisilerDizisi.length; i++) {
        if (tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent) {
            tumKisilerDizisi[i] = kisi;
            break;
        }
    }
    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[2].textContent = kisi.mail;
    secilenSatir.cells[1].textContent = kisi.soyad;

    document.querySelector('.kaydet-guncelle').value = 'Kaydet';
    secilenSatir = undefined;
    console.log(tumKisilerDizisi);
}
