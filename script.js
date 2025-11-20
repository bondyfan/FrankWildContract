document.addEventListener('DOMContentLoaded', () => {
    // Pomocná funkce
    const get = (id) => document.getElementById(id);
    
    // Datum
    const today = new Date().toLocaleDateString('cs-CZ');
    const outDate = get('outDate');
    if (outDate) outDate.innerText = today;


    // Proměnná pro aktuální typ smlouvy
    let currentContractType = 'A';

    // Funkce pro výběr smlouvy
    window.selectContract = function(type) {
        currentContractType = type;
        
        // Skrýt výběrovou obrazovku
        get('selectionScreen').style.display = 'none';
        
        // Zobrazit správné ovládací prvky
        get('controls-contract-a').style.display = type === 'A' ? 'block' : 'none';
        get('controls-contract-b').style.display = type === 'B' ? 'block' : 'none';
        
        // Zobrazit správný zdroj pro náhled
        get('source-contract-a').style.display = type === 'A' ? 'block' : 'none';
        get('source-contract-b').style.display = type === 'B' ? 'block' : 'none';
        
        // Aktualizovat titulek
        get('appTitle').innerText = type === 'A' ? 'Generátor smluv v2.0 (Spolupráce)' : 'Generátor smluv v2.0 (Model Release)';
        
        // Spustit update
        updateContract();
    }

    // Funkce pro přepínání polí pro nezletilé
    window.toggleMinorFields = function() {
        const isMinor = get('checkMinor').checked;
        get('minorFields').style.display = isMinor ? 'block' : 'none';
        get('outBMinorSection').style.display = isMinor ? 'block' : 'none';
        updateContract();
    }

    // Hlavní funkce aktualizace
    function updateContract() {
        if (currentContractType === 'A') {
            updateContractA();
        } else {
            updateContractB();
        }
        // Po aktualizaci dat spustit paginaci (s malým zpožděním)
        setTimeout(paginate, 50);
    }

    function updateContractA() {
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

    function updateContractB() {
        get('outBProject').innerText = get('inpBProject').value || "...........................";
        get('outBDateShoot').innerText = get('inpBDateShoot').value || "...........................";
        
        const name = get('inpBName').value;
        get('outBName').innerText = name || "........................................";
        get('outBNameText').innerText = name || "________________________________";
        
        get('outBDob').innerText = get('inpBDob').value || "........................................";
        get('outBId').innerText = get('inpBId').value || "........................................";
        get('outBAddress').innerText = get('inpBAddress').value || "........................................";

        // Nezletilý
        if (get('checkMinor').checked) {
            get('outBGuardianName').innerText = get('inpBGuardianName').value || "........................................";
            get('outBGuardianId').innerText = get('inpBGuardianId').value || "........................................";
            
            const relSelect = get('inpBGuardianRel');
            get('outBGuardianRel').innerText = relSelect.options[relSelect.selectedIndex].text.toLowerCase();
        }
    }


    function updateCheckbox(inputId, outputId) {
        const isChecked = get(inputId).checked;
        get(outputId).innerText = isChecked ? "☒" : "☐";
        get(outputId).parentElement.style.fontWeight = isChecked ? "bold" : "normal";
    }


    // Listenery
    // Poznámka: inputy jsou nyní vybírány dynamicky, ale protože jsou v DOMu od začátku (jen skryté),
    // můžeme na ně navázat listenery rovnou.
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        // Pro jistotu odstraníme staré listenery (pokud by se skript spouštěl vícekrát, což tady nehrozí, ale je to good practice)
        input.removeEventListener('input', updateContract);
        input.removeEventListener('change', updateContract);
        
        input.addEventListener('input', updateContract);
        input.addEventListener('change', updateContract);
    });

    // Paginace (rozdělení na stránky)
    function paginate() {
        // Zdroj je nyní dynamický podle typu smlouvy, ale my bereme #contractSource wrapper
        // Uvnitř #contractSource jsou #source-contract-a a #source-contract-b.
        // Musíme vzít ten viditelný.
        
        let activeSourceId = currentContractType === 'A' ? 'source-contract-a' : 'source-contract-b';
        const source = get(activeSourceId);
        const container = get('pagesContainer');
        
        if (!source || !container) return;

        // Vyčistit kontejner
        container.innerHTML = '';

        // Vytvořit první stránku
        let currentPage = createNewPage();
        container.appendChild(currentPage);

        // Projít všechna elementy ve zdroji
        const children = Array.from(source.children);
        
        children.forEach(child => {
            // Naklonovat element (aby zůstal ve zdroji pro příští update)
            const clone = child.cloneNode(true);
            
            // Pokud je element skrytý (např. sekce nezletilý), nepřidávat ho pokud je display none
            // Musíme zkontrolovat computed style, protože display:none může být v CSS třídě nebo inline
            const style = window.getComputedStyle(child);
            if (style.display === 'none') {
                return; 
            }

            currentPage.appendChild(clone);

            // Zkontrolovat, zda se element vejde
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

    // Prvotní spuštění
    setTimeout(paginate, 100);

});
