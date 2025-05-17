const poczatkowaBazaSkladnikow = {
    "platki owsiane":{kalorieNa100g:350},"mleko 2%":{kalorieNa100g:50},"napoj migdalowy":{kalorieNa100g:24},"banan":{kalorieNa100g:89},"jablko":{kalorieNa100g:52},"gruszka":{kalorieNa100g:57},"mandarynka":{kalorieNa100g:53},"orzechy wloskie":{kalorieNa100g:654},"migdaly":{kalorieNa100g:579},"rodzynki":{kalorieNa100g:299},"kakao (proszek)":{kalorieNa100g:228},"nasiona chia":{kalorieNa100g:486},"miod":{kalorieNa100g:304},"jogurt naturalny":{kalorieNa100g:61},"chleb pelnoziarnisty":{kalorieNa100g:250},"awokado":{kalorieNa100g:160},"jajko":{kalorieNa100g:143},"kasza peczak (sucha)":{kalorieNa100g:337},"kasza jeczmienna (sucha)":{kalorieNa100g:354},"kasza bulgur (sucha)":{kalorieNa100g:342},"kasza gryczana (sucha)":{kalorieNa100g:343},"kasza jaglana (sucha)":{kalorieNa100g:378},"ryz brazowy (suchy)":{kalorieNa100g:360},"makaron pelnoziarnisty (suchy)":{kalorieNa100g:350},"maka pszenna":{kalorieNa100g:364},"ziemniaki":{kalorieNa100g:77},"losos (surowy)":{kalorieNa100g:208},"dorsz (surowy)":{kalorieNa100g:82},"krewetki (gotowane)":{kalorieNa100g:99},"tofu naturalne":{kalorieNa100g:76},"soczewica czerwona (sucha)":{kalorieNa100g:353},"szpinak":{kalorieNa100g:23},"brokul":{kalorieNa100g:34},"papryka czerwona":{kalorieNa100g:31},"marchew":{kalorieNa100g:41},"cukinia":{kalorieNa100g:17},"cebula":{kalorieNa100g:40},"pomidor":{kalorieNa100g:18},"oliwa z oliwek":{kalorieNa100g:884},"ser feta":{kalorieNa100g:264},"czosnek":{kalorieNa100g:149},"kefir naturalny":{kalorieNa100g:51},"maslanka naturalna":{kalorieNa100g:40},"truskawki":{kalorieNa100g:32},"pomarancza":{kalorieNa100g:47},"maslo orzechowe":{kalorieNa100g:588},"tunczyk w sosie wlasnym (odsaczony)":{kalorieNa100g:100},"salata lodowa":{kalorieNa100g:14},"ogorek zielony":{kalorieNa100g:15},"kukurydza konserwowa":{kalorieNa100g:86},"rzodkiewka":{kalorieNa100g:16},"oliwki zielone":{kalorieNa100g:145},"pieczarki":{kalorieNa100g:22}
};
let bazaSkladnikow = JSON.parse(JSON.stringify(poczatkowaBazaSkladnikow));
let listaSkladnikow = Object.keys(bazaSkladnikow).sort();

const typyPosilkow = ['sniadanie', 'obiad', 'przekaska', 'kolacja'];
const themeCheckbox = document.getElementById('theme-checkbox');
const bodyElement = document.body;
const dziennyLimitKalorii = 1500;
const appHeaderElement = document.getElementById('app-header');

const saveButton = document.getElementById('save-button');
const loadFileInput = document.getElementById('load-file-input');
const datePickerModal = document.getElementById('date-picker-modal');
const saveDatePicker = document.getElementById('save-date-picker');
const confirmSaveDateButton = document.getElementById('confirm-save-date');
const cancelSaveDateButton = document.getElementById('cancel-save-date');

const fabOpenCustomIngredientButton = document.getElementById('fab-open-custom-ingredient');
const customIngredientModal = document.getElementById('custom-ingredient-modal');
const closeCustomIngredientModalButton = document.getElementById('close-custom-ingredient-modal-button');
const addCustomIngredientConfirmButton = document.getElementById('add-custom-ingredient-confirm-button');
const customModalIngredientNameInput = document.getElementById('custom-modal-ingredient-name');
const customModalIngredientCaloriesInput = document.getElementById('custom-modal-ingredient-calories');
const sessionCustomIngredientsListUl = document.querySelector('#session-custom-ingredients-list ul');

const fabGenerateShoppingListButton = document.getElementById('fab-generate-shopping-list');
const shoppingListModal = document.getElementById('shopping-list-modal');
const modalShoppingListDisplay = document.getElementById('modal-shopping-list-display');
const modalSaveShoppingListButton = document.getElementById('modal-save-shopping-list-button');
const closeShoppingListModalButton = document.getElementById('close-shopping-list-modal-button');

const shoppingListContainer = document.getElementById('shopping-list-container');
const shoppingListDisplay = document.getElementById('shopping-list-display');
const saveShoppingListButton = document.getElementById('save-shopping-list-button');

// --- MODAL CZYSZCZENIA LOCALSTORAGE ---
const fabClearLocalStorageBtn = document.getElementById('fab-clear-localstorage');
const clearLocalStorageModal = document.getElementById('clear-localstorage-modal');
const confirmClearLocalStorageBtn = document.getElementById('confirm-clear-localstorage-btn');
const cancelClearLocalStorageBtn = document.getElementById('cancel-clear-localstorage-btn');

fabClearLocalStorageBtn.addEventListener('click', () => {
    clearLocalStorageModal.classList.add('visible');
});
cancelClearLocalStorageBtn.addEventListener('click', () => {
    clearLocalStorageModal.classList.remove('visible');
});
confirmClearLocalStorageBtn.addEventListener('click', () => {
    clearLocalStorageModal.classList.remove('visible');
    localStorage.clear();
    showToast("Wyczyszczono localStorage!", "success");
    initializeTheme();
    wyczyscAktualnyJadlospis();
    setAppHeader(`Nowy Dzień - ${getCurrentDateFormattedForDisplay()}`);
});

// --- TOASTY ---
function showToast(msg, type = "success") {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = "toast toast-" + type + " show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2200);
}

// --- FUNKCJE DODATKOWE DO ZAPISU/ODCZYTU STANU ---
function zapiszStanDoLocalStorage() {
    const jadlospis = zbierzDaneJadlospisu();
    localStorage.setItem('jadlospis', JSON.stringify(jadlospis));
}

function przywrocStanZLocalStorage() {
    const zapisanyJadlospis = localStorage.getItem('jadlospis');
    if (zapisanyJadlospis) {
        try {
            const obj = JSON.parse(zapisanyJadlospis);
            zastosujWczytanyJadlospis(obj);
            setAppHeader(`Przywrócono jadłospis z pamięci`);
        } catch (e) {
            localStorage.removeItem('jadlospis');
        }
    } else {
        aktualizujWszystkieListyWyboruSkladnikow();
        typyPosilkow.forEach(typ => przeliczKalorie(typ));
        odswiezListeWlasnychSkladnikowWSesji();
    }
}

// --- RESZTA LOGIKI ---
function setAppHeader(text) { appHeaderElement.textContent = text; }
function getCurrentDateFormattedForInput() { return new Date().toISOString().split('T')[0]; }
function getCurrentDateFormattedForDisplay() {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
}
function formatDateForDisplay(dateStringYYYYMMDD) {
    if (!dateStringYYYYMMDD) return getCurrentDateFormattedForDisplay();
    const [year, month, day] = dateStringYYYYMMDD.split('-');
    return `${day}.${month}.${year}`;
}

function applyTheme(theme) {
    bodyElement.classList.toggle('dark-mode', theme === 'dark');
    themeCheckbox.checked = (theme === 'dark');
    aktualizujSumeDniaCala();
}
function initializeTheme() {
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);
}

themeCheckbox.addEventListener('change', () => {
    const newTheme = themeCheckbox.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function aktualizujWszystkieListyWyboruSkladnikow() {
    document.querySelectorAll('.ingredients-container select').forEach(selectElement => {
        const currentValue = selectElement.value;
        selectElement.innerHTML = '<option value="">--Wybierz--</option>';

        const customIngredientsGroup = document.createElement('optgroup');
        customIngredientsGroup.label = 'Własne Składniki';
        let hasCustom = false;
        const baseIngredientsGroup = document.createElement('optgroup');
        baseIngredientsGroup.label = 'Składniki z Bazy';

        listaSkladnikow.forEach(skladnik => {
            const option = document.createElement('option');
            option.value = skladnik;
            option.textContent = skladnik.charAt(0).toUpperCase() + skladnik.slice(1);

            if (bazaSkladnikow[skladnik] && (bazaSkladnikow[skladnik].wlasny === true || !poczatkowaBazaSkladnikow[skladnik])) {
                customIngredientsGroup.appendChild(option);
                hasCustom = true;
            } else {
                baseIngredientsGroup.appendChild(option);
            }
        });

        if (hasCustom && customIngredientsGroup.children.length > 0) {
            selectElement.appendChild(customIngredientsGroup);
        }
        if (baseIngredientsGroup.children.length > 0) {
            selectElement.appendChild(baseIngredientsGroup);
        }

        if (listaSkladnikow.includes(currentValue)) {
            selectElement.value = currentValue;
        } else {
            selectElement.value = "";
        }
    });
}

fabOpenCustomIngredientButton.addEventListener('click', () => customIngredientModal.classList.add('visible'));
closeCustomIngredientModalButton.addEventListener('click', () => customIngredientModal.classList.remove('visible'));

addCustomIngredientConfirmButton.addEventListener('click', () => {
    const name = customModalIngredientNameInput.value.trim().toLowerCase();
    const calories = parseFloat(customModalIngredientCaloriesInput.value);

    if (!name) { showToast("Proszę podać nazwę własnego składnika.", "error"); customModalIngredientNameInput.focus(); return; }
    if (isNaN(calories) || calories < 0) { showToast("Proszę podać poprawną liczbę kalorii.", "error"); customModalIngredientCaloriesInput.focus(); return; }

    let isNew = !bazaSkladnikow[name] || !bazaSkladnikow[name].wlasny;
    if (bazaSkladnikow[name] && !bazaSkladnikow[name].wlasny && !confirm(`Składnik "${name}" istnieje w bazie. Czy chcesz go nadpisać jako własny z nową kalorycznością?`)) return;
    else if (bazaSkladnikow[name] && bazaSkladnikow[name].wlasny && bazaSkladnikow[name].kalorieNa100g !== calories && !confirm(`Własny składnik "${name}" już istnieje. Czy chcesz nadpisać jego kaloryczność?`)) return;

    bazaSkladnikow[name] = { kalorieNa100g: calories, wlasny: true };
    if (!listaSkladnikow.includes(name)) {
        listaSkladnikow.push(name);
        listaSkladnikow.sort();
    }

    aktualizujWszystkieListyWyboruSkladnikow();
    odswiezListeWlasnychSkladnikowWSesji();
    showToast(`Składnik "${name}" (${calories} kcal/100g) został ${isNew ? 'dodany jako własny' : 'zaktualizowany'}.`, "success");
    customModalIngredientNameInput.value = "";
    customModalIngredientCaloriesInput.value = "";
    zapiszStanDoLocalStorage();
});

function odswiezListeWlasnychSkladnikowWSesji() {
    sessionCustomIngredientsListUl.innerHTML = "";
    let hasCustom = false;
    const wlasneSkladniki = listaSkladnikow.filter(nazwaSkladnika =>
        bazaSkladnikow[nazwaSkladnika] && (bazaSkladnikow[nazwaSkladnika].wlasny || !poczatkowaBazaSkladnikow[nazwaSkladnika])
    ).sort();

    wlasneSkladniki.forEach(nazwaSkladnika => {
        const li = document.createElement('li');
        li.textContent = `${nazwaSkladnika.charAt(0).toUpperCase() + nazwaSkladnika.slice(1)} (${bazaSkladnikow[nazwaSkladnika].kalorieNa100g} kcal/100g)`;
        sessionCustomIngredientsListUl.appendChild(li);
        hasCustom = true;
    });
    if (!hasCustom) sessionCustomIngredientsListUl.innerHTML = "<li>Brak własnych składników.</li>";
}

function dodajSkladnik(typPosilku, skladnikData = null, kalkulujOdRazu = true) {
    const container = document.getElementById(`${typPosilku}-skladniki`);
    const ingredientRow = document.createElement('div');
    ingredientRow.classList.add('ingredient-row');
    const rowId = `${typPosilku}-skladnik-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const selectId = `${rowId}-select`;
    const selectElement = document.createElement('select');
    selectElement.id = selectId;

    const defaultOption = document.createElement('option');
    defaultOption.value = ""; defaultOption.textContent = "--Wybierz--";
    selectElement.appendChild(defaultOption);

    const customIngredientsGroup = document.createElement('optgroup');
    customIngredientsGroup.label = 'Własne Składniki'; let hasCustomInDropdown = false;
    const baseIngredientsGroup = document.createElement('optgroup');
    baseIngredientsGroup.label = 'Składniki z Bazy';

    listaSkladnikow.forEach(skladnikIter => {
        const option = document.createElement('option');
        option.value = skladnikIter;
        option.textContent = skladnikIter.charAt(0).toUpperCase() + skladnikIter.slice(1);
        if (skladnikData && skladnikData.nazwa === skladnikIter) {
            option.selected = true;
        }

        if (bazaSkladnikow[skladnikIter] && (bazaSkladnikow[skladnikIter].wlasny === true || !poczatkowaBazaSkladnikow[skladnikIter])) {
            customIngredientsGroup.appendChild(option); hasCustomInDropdown = true;
        } else {
            baseIngredientsGroup.appendChild(option);
        }
    });
    if (hasCustomInDropdown && customIngredientsGroup.hasChildNodes()) selectElement.appendChild(customIngredientsGroup);
    if (baseIngredientsGroup.hasChildNodes()) selectElement.appendChild(baseIngredientsGroup);

    const iloscValue = (skladnikData && skladnikData.ilosc) ? skladnikData.ilosc : "";

    const group1 = document.createElement('div');
    group1.classList.add('input-group');
    const label1 = document.createElement('label');
    label1.htmlFor = selectId; label1.textContent = "Składnik:";
    group1.appendChild(label1); group1.appendChild(selectElement);

    const group2 = document.createElement('div');
    group2.classList.add('input-group');
    const label2 = document.createElement('label');
    label2.htmlFor = `${rowId}-gramatura`; label2.classList.add('gramatura-label'); label2.textContent = "Ilość (g):";
    const inputGrams = document.createElement('input');
    inputGrams.type = "number"; inputGrams.id = `${rowId}-gramatura`; inputGrams.classList.add('grams-input');
    inputGrams.placeholder = "g"; inputGrams.value = iloscValue; inputGrams.min = "0";
    group2.appendChild(label2); group2.appendChild(inputGrams);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('ingredient-actions');
    const caloriesDisplay = document.createElement('span');
    caloriesDisplay.classList.add('calories-display'); caloriesDisplay.id = `${rowId}-kalorie`; caloriesDisplay.textContent = "0 kcal";
    const removeButton = document.createElement('button');
    removeButton.type = "button"; removeButton.classList.add('remove-btn', 'action-button'); removeButton.textContent = "Usuń";
    removeButton.onclick = () => usunSkladnik(ingredientRow, typPosilku);
    actionsDiv.appendChild(caloriesDisplay); actionsDiv.appendChild(removeButton);

    ingredientRow.appendChild(group1); ingredientRow.appendChild(group2); ingredientRow.appendChild(actionsDiv);
    container.appendChild(ingredientRow);

    if (skladnikData && skladnikData.nazwa) {
        selectElement.value = skladnikData.nazwa;
    }
    selectElement.onchange = () => przeliczKalorie(typPosilku);
    inputGrams.oninput = () => przeliczKalorie(typPosilku);

    if (kalkulujOdRazu) {
        przeliczKalorie(typPosilku);
    }
    zapiszStanDoLocalStorage();
}

function usunSkladnik(rowElement, typPosilku) {
    if (rowElement) { rowElement.remove(); przeliczKalorie(typPosilku); }
    zapiszStanDoLocalStorage();
}

function przeliczKalorie(typPosilku) {
    const container = document.getElementById(`${typPosilku}-skladniki`);
    let sumaKaloriiPosilku = 0;
    if (container) {
        Array.from(container.children).forEach(row => {
            const selectElement = row.querySelector('select');
            const inputElement = row.querySelector('input[type="number"].grams-input');
            const caloriesDisplayElement = row.querySelector('.calories-display');
            if (selectElement && inputElement && caloriesDisplayElement) {
                const wybranySkladnik = selectElement.value;
                const gramatura = parseFloat(inputElement.value) || 0;
                let kalorieSkladnika = 0;
                if (wybranySkladnik && bazaSkladnikow[wybranySkladnik] && gramatura > 0) {
                    kalorieSkladnika = (gramatura / 100) * bazaSkladnikow[wybranySkladnik].kalorieNa100g;
                    sumaKaloriiPosilku += kalorieSkladnika;
                }
                caloriesDisplayElement.textContent = `${kalorieSkladnika.toFixed(0)} kcal`;
            }
        });
    }
    const sumaPosilkuElement = document.getElementById(`${typPosilku}-kalorie-suma`);
    if (sumaPosilkuElement) sumaPosilkuElement.textContent = sumaKaloriiPosilku.toFixed(0);
    aktualizujSumeDniaCala();
    zapiszStanDoLocalStorage();
}

function aktualizujSumeDniaCala() {
    let sumaCalkowita = 0;
    typyPosilkow.forEach(typ => {
        const el = document.getElementById(`${typ}-kalorie-suma`);
        if (el) sumaCalkowita += parseFloat(el.textContent) || 0;
    });
    const aktualnaSumaEl = document.getElementById('dzienna-suma-aktualna');
    if (aktualnaSumaEl) {
        aktualnaSumaEl.textContent = sumaCalkowita.toFixed(0);
        aktualnaSumaEl.classList.toggle('calories-exceeded', sumaCalkowita > dziennyLimitKalorii);
    }
    // Progress bar:
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        let procent = Math.min((sumaCalkowita / dziennyLimitKalorii) * 100, 100);
        progressBar.style.width = `${procent}%`;
        progressBar.classList.toggle('exceeded', sumaCalkowita > dziennyLimitKalorii);
    }
}

function zbierzDaneJadlospisu() {
    const jadlospis = { data: "", posilki: {}, definicjeWlasnychSkladnikow: {} };
    typyPosilkow.forEach(typ => {
        jadlospis.posilki[typ] = [];
        const container = document.getElementById(`${typ}-skladniki`);
        if (container) {
            Array.from(container.children).forEach(row => {
                const sel = row.querySelector('select');
                const inp = row.querySelector('input[type="number"].grams-input');
                if (sel && inp && sel.value && parseFloat(inp.value) > 0) {
                    const nazwa = sel.value;
                    const ilosc = parseFloat(inp.value);
                    jadlospis.posilki[typ].push({ nazwa, ilosc });
                    if (bazaSkladnikow[nazwa] && (bazaSkladnikow[nazwa].wlasny === true || !poczatkowaBazaSkladnikow[nazwa])) {
                        jadlospis.definicjeWlasnychSkladnikow[nazwa] = bazaSkladnikow[nazwa].kalorieNa100g;
                    }
                }
            });
        }
    });
    return jadlospis;
}

saveButton.addEventListener('click', () => {
    saveDatePicker.value = getCurrentDateFormattedForInput();
    datePickerModal.classList.add('visible');
});
cancelSaveDateButton.addEventListener('click', () => datePickerModal.classList.remove('visible'));

confirmSaveDateButton.addEventListener('click', () => {
    const wybranaData = saveDatePicker.value;
    if (!wybranaData) { showToast("Proszę wybrać datę.", "error"); return; }
    datePickerModal.classList.remove('visible');
    const jadlospisDoZapisu = zbierzDaneJadlospisu();
    jadlospisDoZapisu.data = wybranaData;
    const jsonData = JSON.stringify(jadlospisDoZapisu, null, 2);
    const blob = new Blob([jsonData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `jadlospis-${wybranaData}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setAppHeader(`Jadłospis z Dnia: ${formatDateForDisplay(wybranaData)}`);
});

loadFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wczytanyJadlospis = JSON.parse(e.target.result);
                zastosujWczytanyJadlospis(wczytanyJadlospis);
                setAppHeader(`Jadłospis z Dnia: ${formatDateForDisplay(wczytanyJadlospis.data)}`);
                zapiszStanDoLocalStorage();
            } catch (err) {
                showToast("Błąd wczytywania pliku.", "error");
                setAppHeader(`Nowy Dzień - ${getCurrentDateFormattedForDisplay()}`);
            }
        };
        reader.readAsText(file);
        loadFileInput.value = "";
    }
});

function wyczyscAktualnyJadlospis() {
    typyPosilkow.forEach(typ => {
        const container = document.getElementById(`${typ}-skladniki`);
        if (container) container.innerHTML = "";
    });
    bazaSkladnikow = JSON.parse(JSON.stringify(poczatkowaBazaSkladnikow));
    listaSkladnikow = Object.keys(bazaSkladnikow).sort();
    odswiezListeWlasnychSkladnikowWSesji();
    aktualizujWszystkieListyWyboruSkladnikow();
    typyPosilkow.forEach(typ => przeliczKalorie(typ));
    localStorage.removeItem('jadlospis');
}

function zastosujWczytanyJadlospis(jadlospis) {
    wyczyscAktualnyJadlospis();

    if (jadlospis.definicjeWlasnychSkladnikow) {
        for (const nazwaSkladnika in jadlospis.definicjeWlasnychSkladnikow) {
            bazaSkladnikow[nazwaSkladnika] = {
                kalorieNa100g: jadlospis.definicjeWlasnychSkladnikow[nazwaSkladnika],
                wlasny: true
            };
            if (!listaSkladnikow.includes(nazwaSkladnika)) {
                listaSkladnikow.push(nazwaSkladnika);
            }
        }
        listaSkladnikow.sort();
    }
    aktualizujWszystkieListyWyboruSkladnikow();
    odswiezListeWlasnychSkladnikowWSesji();

    if (jadlospis.posilki) {
        typyPosilkow.forEach(typ => {
            if (jadlospis.posilki[typ] && Array.isArray(jadlospis.posilki[typ])) {
                jadlospis.posilki[typ].forEach(skladnik => {
                    if(bazaSkladnikow[skladnik.nazwa]){
                        dodajSkladnik(typ, skladnik, false);
                    } else {
                        console.warn(`Składnik "${skladnik.nazwa}" z wczytanego pliku nie ma definicji w bazie i nie został dodany.`);
                    }
                });
            }
        });
        typyPosilkow.forEach(typ => przeliczKalorie(typ));
    }
    zapiszStanDoLocalStorage();
}

fabGenerateShoppingListButton.addEventListener('click', () => {
    const jadlospis = zbierzDaneJadlospisu();
    const agregowaneSkladniki = {};
    Object.values(jadlospis.posilki).forEach(posilek => {
        posilek.forEach(skladnik => {
            agregowaneSkladniki[skladnik.nazwa] = (agregowaneSkladniki[skladnik.nazwa] || 0) + skladnik.ilosc;
        });
    });

    modalShoppingListDisplay.innerHTML = "";
    if (Object.keys(agregowaneSkladniki).length > 0) {
        Object.entries(agregowaneSkladniki).sort((a,b) => a[0].localeCompare(b[0])).forEach(([nazwa, ilosc]) => {
            const li = document.createElement('li');
            li.textContent = `${nazwa.charAt(0).toUpperCase() + nazwa.slice(1)}: ${ilosc.toFixed(0)} g`;
            modalShoppingListDisplay.appendChild(li);
        });
        modalSaveShoppingListButton.style.display = 'inline-block';
    } else {
        modalShoppingListDisplay.innerHTML = "<li>Brak składników w jadłospisie.</li>";
        modalSaveShoppingListButton.style.display = 'none';
    }
    shoppingListModal.classList.add('visible');
});

closeShoppingListModalButton.addEventListener('click', () => {
    shoppingListModal.classList.remove('visible');
});

modalSaveShoppingListButton.addEventListener('click', () => {
    let textContent = "Lista Zakupów:\n\n";
    modalShoppingListDisplay.querySelectorAll('li').forEach(li => {
        textContent += `- ${li.textContent}\n`;
    });
    const blob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-zakupow-${getCurrentDateFormattedForInput()}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

window.onload = function() {
    initializeTheme();
    setAppHeader(`Nowy Dzień - ${getCurrentDateFormattedForDisplay()}`);
    const limitSumaEl = document.getElementById('dzienna-suma-limit');
    if (limitSumaEl) limitSumaEl.textContent = dziennyLimitKalorii;
    przywrocStanZLocalStorage();
};