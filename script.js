document.addEventListener('DOMContentLoaded', () => {
    // Pomocná funkce
    const get = (id) => document.getElementById(id);
    
    // Stav
    let currentContractType = null; // 'cooperation' nebo 'modelRelease'

    // Datum
    const today = new Date().toLocaleDateString('cs-CZ');
    const outDate = get('outDate');
    if (outDate) outDate.innerText = today;

    // Expose selectContract to global scope
    window.selectContract = function(type) {
        currentContractType = type;
        
        // Skrýt modal
        get('contractSelectionModal').style.display = 'none';
        
        // Zobrazit/Skrýt specifické části formuláře
        if (type === 'cooperation') {
            get('formSpecifics_Cooperation').style.display = 'block';
            get('formSpecifics_ModelRelease').style.display = 'none';
            get('contractTitle').innerText = "Smlouva o spolupráci";
        } else {
            get('formSpecifics_Cooperation').style.display = 'none';
            get('formSpecifics_ModelRelease').style.display = 'block';
            get('contractTitle').innerText = "Model Release Form";
        }

        // Spustit update
        updateContract();
    }

    // Hlavní funkce aktualizace
    function updateContract() {
        if (!currentContractType) return;

        // Zjistit typ osoby (společné pro oba)
        const isCompany = document.querySelector('input[name="entityType"][value="company"]').checked;

        // Aktualizovat labely podle typu osoby
        if (isCompany) {
            // FORM
            get('lblName').innerText = "Název společnosti";
            get('lblDob').innerText = "IČO";
            get('lblIdNumber').innerText = "DIČ (nepovinné) / Spisová značka";
            get('lblPermanentAddress').innerText = "Sídlo společnosti";
            get('divCurrentAddress').style.display = 'none';
            
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

            get('inpName').placeholder = "např. Jan Novák";
            get('inpDob').placeholder = "např. 1. 1. 2000";
            get('inpIdNumber').placeholder = "např. 123456789";
            get('inpPermanentAddress').placeholder = "např. Dlouhá 5, Praha";
        }

        // Společná data
        const name = get('inpName').value;
        const dob = get('inpDob').value;
        const idNumber = get('inpIdNumber').value;
        const address = get('inpPermanentAddress').value;
        const currentAddress = get('inpCurrentAddress').value;

        if (currentContractType === 'cooperation') {
            // --- SMLOUVA O SPOLUPRÁCI ---
            
            // Labely v náhledu
            if (isCompany) {
                get('outLblName').innerText = "Název společnosti";
                get('outLblDob').innerText = "IČO";
                get('outLblIdNumber').innerText = "DIČ / Spisová značka";
                get('outLblPermanentAddress').innerText = "Sídlo";
                get('rowCurrentAddress').style.display = 'none';
            } else {
                get('outLblName').innerText = "Jméno a příjmení";
                get('outLblDob').innerText = "Datum narození";
                get('outLblIdNumber').innerText = "Číslo dokladu (OP/Pas)";
                get('outLblPermanentAddress').innerText = "Trvalé bydliště";
                get('rowCurrentAddress').style.display = 'inline';
            }

            // Vyplnění dat
            get('outName').innerText = name || "........................................";
            get('outNameSign').innerText = name || "Příjemce";
            get('outDob').innerText = dob || "........................................";
            get('outIdNumber').innerText = idNumber || "........................................";
            get('outPermanentAddress').innerText = address || "........................................";
            get('outCurrentAddress').innerText = currentAddress || "........................................";
            
            get('outProject').innerText = get('inpProject').value || "........................................";
            get('outPercent').innerText = get('inpPercent').value || ".....";

            // Role
            updateCheckbox('checkRole1', 'markRole1');
            updateCheckbox('checkRole2', 'markRole2');
            updateCheckbox('checkRole3', 'markRole3');
            
            const otherRole = get('inpRoleOther').value;
            if (otherRole) {
                get('markRoleOther').innerText = "☒";
                get('outRoleOther').innerText = otherRole;
            } else {
                get('markRoleOther').innerText = "☐";
                get('outRoleOther').innerText = "";
            }

            // Zdroje
            const radios = document.getElementsByName('source');
            let selectedSource = "C";
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

        } else {
            // --- MODEL RELEASE ---
            
            get('outMRName').innerText = name || "........................................";
            get('outMRNameBox').innerText = name || "........................................";
            get('outMRDob').innerText = dob || "........................................";
            get('outMRId').innerText = idNumber || "........................................";
            get('outMRAddress').innerText = address || "........................................";

            get('outMRProject').innerText = get('inpMRProject').value || "........................................";
            get('outMRDate').innerText = get('inpMRDate').value || "........................................";

            // Nezletilost
            const isMinor = get('checkMinor').checked;
            const guardianDiv = get('divGuardian');
            const outMinorSection = get('outMRMinorSection');

            if (isMinor) {
                guardianDiv.style.display = 'block';
                outMinorSection.style.display = 'block';
                
                get('outMRGuardianName').innerText = get('inpGuardianName').value || "........................................";
                get('outMRGuardianId').innerText = get('inpGuardianId').value || "........................................";
            } else {
                guardianDiv.style.display = 'none';
                outMinorSection.style.display = 'none';
            }
        }

        // Spustit paginaci
        setTimeout(paginate, 10);
    }


    function updateCheckbox(inputId, outputId) {
        const isChecked = get(inputId).checked;
        const outEl = get(outputId);
        if (outEl) {
            outEl.innerText = isChecked ? "☒" : "☐";
            outEl.parentElement.style.fontWeight = isChecked ? "bold" : "normal";
        }
    }


    // Listenery
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateContract);
        input.addEventListener('change', updateContract);
    });


    // Paginace
    function paginate() {
        if (!currentContractType) return;

        const sourceId = currentContractType === 'cooperation' ? 'contractSource' : 'contractSourceModelRelease';
        const source = get(sourceId);
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
            // Pokud je element skrytý (např. sekce nezletilosti), přeskočit
            if (window.getComputedStyle(child).display === 'none') return;

            // Naklonovat element
            const clone = child.cloneNode(true);
            currentPage.appendChild(clone);

            // Zkontrolovat, zda se element vejde
            // Bezpečný limit cca 950px pro A4
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
        div.className = 'a4-page mb-8';
        return div;
    }

});
