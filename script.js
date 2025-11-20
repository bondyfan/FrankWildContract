document.addEventListener('DOMContentLoaded', () => {
    // Pomocná funkce
    const get = (id) => document.getElementById(id);
    
    // Datum
    const today = new Date().toLocaleDateString('cs-CZ');
    const outDate = get('outDate');
    if (outDate) outDate.innerText = today;


    // Hlavní funkce aktualizace
    function updateContract() {
        // Zjistit typ osoby
        const isCompany = document.querySelector('input[name="entityType"][value="company"]').checked;

        // Aktualizovat labely podle typu osoby
        if (isCompany) {
            // FORM
            get('lblName').innerText = "Název společnosti";
            get('lblDob').innerText = "IČO";
            get('lblIdNumber').innerText = "DIČ (nepovinné) / Spisová značka";
            get('lblPermanentAddress').innerText = "Sídlo společnosti";
            get('divCurrentAddress').style.display = 'none';
            
            // PREVIEW
            get('outLblName').innerText = "Název společnosti";
            get('outLblDob').innerText = "IČO";
            get('outLblIdNumber').innerText = "DIČ / Spisová značka";
            get('outLblPermanentAddress').innerText = "Sídlo";
            get('rowCurrentAddress').style.display = 'none';

            get('inpName').placeholder = "např. Super Label s.r.o.";
            get('inpDob').placeholder = "např. 12345678";
            get('inpIdNumber').placeholder = "např. CZ12345678";
            get('inpPermanentAddress').placeholder = "např. Václavské nám. 1, Praha";

        } else {
            // FORM
            get('lblName').innerText = "Jméno a příjmení";
            get('lblDob').innerText = "Datum narození";
            get('lblIdNumber').innerText = "Číslo Pasu / Občanky";
            get('lblPermanentAddress').innerText = "Trvalé bydliště";
            get('divCurrentAddress').style.display = 'block';

            // PREVIEW
            get('outLblName').innerText = "Jméno a příjmení";
            get('outLblDob').innerText = "Datum narození";
            get('outLblIdNumber').innerText = "Číslo dokladu (OP/Pas)";
            get('outLblPermanentAddress').innerText = "Trvalé bydliště";
            get('rowCurrentAddress').style.display = 'inline'; // Span wrapper

            get('inpName').placeholder = "např. Jan Novák";
            get('inpDob').placeholder = "např. 1. 1. 2000";
            get('inpIdNumber').placeholder = "např. 123456789";
            get('inpPermanentAddress').placeholder = "např. Dlouhá 5, Praha";
        }

        // Textová pole
        const name = get('inpName').value;
        get('outName').innerText = name || "........................................";
        get('outNameSign').innerText = name || "Příjemce";
        
        get('outDob').innerText = get('inpDob').value || "........................................";
        get('outIdNumber').innerText = get('inpIdNumber').value || "........................................";
        get('outPermanentAddress').innerText = get('inpPermanentAddress').value || "........................................";
        get('outCurrentAddress').innerText = get('inpCurrentAddress').value || "........................................";
        
        get('outProject').innerText = get('inpProject').value || "........................................";
        get('outPercent').innerText = get('inpPercent').value || ".....";


        // Role - Checkboxy
        updateCheckbox('checkRole1', 'markRole1');
        updateCheckbox('checkRole2', 'markRole2');
        updateCheckbox('checkRole3', 'markRole3');
        
        // Role - Jiné
        const otherRole = get('inpRoleOther').value;
        if (otherRole) {
            get('markRoleOther').innerText = "☒";
            get('outRoleOther').innerText = otherRole;
        } else {
            get('markRoleOther').innerText = "☐";
            get('outRoleOther').innerText = "";
        }


        // Zdroje peněz (Radio buttons) - ZOBRAZÍME JEN TEXT VYBRANÉHO
        const radios = document.getElementsByName('source');
        let selectedSource = "C"; // Default
        for (const radio of radios) {
            if (radio.checked) selectedSource = radio.value;
        }


        const sourceDiv = get('outSourceText');
        if (selectedSource === 'A') {
            sourceDiv.innerHTML = "POUZE VIDEO PLATFORMY<br><span style='font-weight:normal'>Výnosy zejména z YouTube (AdSense, YouTube Premium) a dalších video serverů.</span>";
        } else if (selectedSource === 'B') {
            sourceDiv.innerHTML = "POUZE AUDIO STREAMOVACÍ SLUŽBY<br><span style='font-weight:normal'>Výnosy z digitální distribuce hudby (Spotify, Apple Music, Deezer, Tidal, Amazon Music a další).</span>";
        } else {
            sourceDiv.innerHTML = "KOMPLETNÍ DIGITÁLNÍ VÝNOSY<br><span style='font-weight:normal'>Výnosy ze všech digitálních zdrojů (YouTube, Spotify, Apple Music a další video i audio platformy).</span>";
        }
    }


    function updateCheckbox(inputId, outputId) {
        const isChecked = get(inputId).checked;
        get(outputId).innerText = isChecked ? "☒" : "☐";
        get(outputId).parentElement.style.fontWeight = isChecked ? "bold" : "normal";
    }


    // Listenery
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateContract);
        input.addEventListener('change', updateContract);
    });


    // Init
    updateContract();

    // Paginace (rozdělení na stránky)
    function paginate() {
        const source = get('contractSource');
        const container = get('pagesContainer');
        if (!source || !container) return;

        // Vyčistit kontejner
        container.innerHTML = '';

        // Vytvořit první stránku
        let currentPage = createNewPage();
        container.appendChild(currentPage);

        // Projít všechny elementy ve zdroji
        const children = Array.from(source.children);
        
        children.forEach(child => {
            // Naklonovat element (aby zůstal ve zdroji pro příští update)
            const clone = child.cloneNode(true);
            currentPage.appendChild(clone);

            // Zkontrolovat, zda se element vejde
            // 297mm (A4 výška) - 40mm (padding nahoře a dole) = cca 257mm
            // V pixelech: 297mm * 3.78 = 1122px. 40mm * 3.78 = 151px. 1122 - 151 = 971px (bezpečný limit)
            // Pro jistotu dáme menší limit, např. 950px
            
            if (currentPage.scrollHeight > currentPage.clientHeight) {
                // Element se nevešel, odebrat ho z této stránky
                currentPage.removeChild(clone);
                
                // Vytvořit novou stránku
                currentPage = createNewPage();
                container.appendChild(currentPage);
                
                // Přidat element na novou stránku
                currentPage.appendChild(clone);
            }
        });

        // Přidat číslování stránek
        const pages = container.querySelectorAll('.a4-page');
        const totalPages = pages.length;
        
        pages.forEach((page, index) => {
            const pageNum = document.createElement('div');
            pageNum.className = 'page-number';
            pageNum.innerText = `Strana ${index + 1} z ${totalPages}`;
            page.appendChild(pageNum);
        });
    }

    function createNewPage() {
        const div = document.createElement('div');
        div.className = 'a4-page mb-8'; // mb-8 pro mezeru mezi stránkami v náhledu
        return div;
    }

    // Spustit paginaci při každé změně
    const originalUpdateContract = updateContract;
    // Přepsat updateContract aby volal i paginaci
    // Musíme to udělat opatrně, aby se necyklilo volání
    
    // Nový observer pro sledování změn ve zdrojovém kontejneru by byl ideální,
    // ale pro jednoduchost zavoláme paginaci po updateContract
    
    // Upravíme listenery, aby volaly paginate
    inputs.forEach(input => {
        input.addEventListener('input', () => {
             // Původní logika už běží v updateContract, která je navázaná, ale my chceme volat i paginate
             setTimeout(paginate, 10); // Malé zpoždění pro překreslení DOM
        });
        input.addEventListener('change', () => {
             setTimeout(paginate, 10);
        });
    });

    // Prvotní spuštění
    setTimeout(paginate, 100);

});
