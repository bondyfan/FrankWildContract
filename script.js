document.addEventListener('DOMContentLoaded', () => {
    // Pomocná funkce
    const get = (id) => document.getElementById(id);
    
    // Datum
    const today = new Date().toLocaleDateString('cs-CZ');
    const outDate = get('outDate');
    if (outDate) outDate.innerText = today;


    // Hlavní funkce aktualizace
    function updateContract() {
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
            sourceDiv.innerHTML = "KOMPLETNÍ DIGITÁLNÍ VÝNOSY<br><span style='font-weight:normal'>Zahrnuje všechny výše uvedené platformy (YouTube, Spotify i další streamovací služby).</span>";
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
});
