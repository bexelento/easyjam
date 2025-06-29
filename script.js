const weaponBtn = document.getElementById('weapon')
const boosterBtn = document.getElementById('booster')
const balanceEl = document.getElementById('balanceh1')
const addBtn = document.getElementById('add')
const mustValue = document.getElementById('mustValue')
const weaponStatus = document.getElementById('weaponStatus')
const notification = document.getElementById('notification')
const workBtn = document.getElementById('work')
const homeBtn = document.getElementById('home')
const laserCount = document.getElementById('laser-count')
const boosterCount = document.getElementById('booster-count')
const shieldCount = document.getElementById('shield-count')
const crystalCount = document.getElementById('crystal-count')
const inputAlert = document.getElementById('input-alert')
const defendAlert = document.getElementById('defend-alert')
const winAlert = document.getElementById('win-alert')
const cryptoInput = document.getElementById('crypto-input')
const alertSubmit = document.getElementById('alert-submit')
const defendBtn = document.getElementById('defend-btn')
const winOk = document.getElementById('win-ok')
let weaponble = false
let balance = 0
let must = generateMust()
let inventory = {
    laser: 0,
    booster: 0,
    shield: 0,
    crystal: 0
}

// утилиты
function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

alert(
    '2125 год . \n  на земле больше не осталось ресурсов и люди стали колонизировать другие планеты.\n' +
    'Вы - один из учетников добытых ресурсов и сейчас ваша миссия - собрать много криптонита.\n' +
    'Удачи!\n' +
    '\n' +
    'пояснение механик игры: \n' +
    'вы получаете уведомление о новой поставке криптонита (или число на табло ТРЕБУЕТСЯ обновиться);' +
    'чтобы зарегистрировать поставку нажмите на одноименную кнопку, не расслабляйтесь обновление ' +
    'поставок проходит каждые 7 секунд, в случае неправильной регистрации вы будете получать штраф. ' +
    'при правильной регистрации 25 монет идут в ваш счет (пытайтесь не обанкротится а то проиграете)\n' +
    'каждые 30 секунд на вас будут нападать существа поэтому захватите бластер(стоит 500 монет или 17 кристалов) ' +
    'или за каждую не удачно отраженную атаку забирают монеты за мед помощь\n' +
    'кристаллы выпадают с малым шансом при получении монеток и их нельзя конвертировать ради баланса вселенной\n' +
    'щиты или квоты уменьшают штраф в 2 раза \n' +
    'чай увеличивает темп майнинга на 0.3 (изначально 0.2/клик)'
)

function showStatus() {
    balanceEl.textContent = `${Math.floor(balance)}`
    mustValue.textContent = must
    weaponStatus.textContent = weaponble ? "✔" : "✖"
    weaponBtn.textContent = weaponble ? "ЛАЗЕР КУПЛЕН" : `КУПИТЬ ЛАЗЕР (500)`
    weaponBtn.disabled = weaponble || balance < 500 && inventory.crystal < 17
    boosterBtn.disabled = balance < 300 && inventory.crystal < 10
}

function showInventory() {
    laserCount.textContent = inventory.laser
    boosterCount.textContent = inventory.booster
    shieldCount.textContent = inventory.shield
    crystalCount.textContent = inventory.crystal
}

async function showNotification(message, error = false) {
    notification.textContent = message;
    notification.style.color = error ? '#ff5555' : '#00ffaa';
    notification.style.opacity = `1`;

    await delay(3000);
    notification.style.opacity = `0`;
}

function lose() {
    alert('ВЫ ПРОИГРАЛИ')
    window.close()
}

let mining = 0.2
let boosterEffect = 0

showStatus()

function generateMust() {
    return Math.floor(Math.random() * 101)
}

function working() {
    let work = mining + (inventory.booster * 0.1) + boosterEffect
    balance += work
    workBtn.textContent = `+${work}`
    showStatus()

    if (Math.random() < 0.05) {
        inventory.crystal++
        showNotification("Найден редкий кристалл!", false)
        showInventory()
    }
}


addBtn.addEventListener('click', () => {
    cryptoInput.value = ""
    inputAlert.style.display = 'flex'
    inputAlert.focus()
    showStatus()
});

alertSubmit.addEventListener('click', async () => {
    const adding = parseInt(cryptoInput.value) || 0
    inputAlert.style.display = 'none'

    if (adding === must) {
        balance += 25;
        must = generateMust()
        await showNotification(`Новая поставка: ${must} единиц и монеты зачислены`);
        if (Math.random() < 0.3) {
            inventory.shield++
            await showNotification("Получена квота защиты!", false);
            showInventory();
        }
    } else {
        let fine = Math.abs(must - adding)

        if (inventory.shield > 0) {
            inventory.shield--
            fine = Math.floor(fine / 2)
            await showNotification(`Квота поглотила часть штрафа ${fine}`, true);
            showInventory()

        } else {
            await showNotification(`Нарушение! Штраф ${fine} монеток`, true);
            showStatus();
        }


        balance = balance - fine;

        if (balance <= 0) {
            await delay(1000);
            lose();
        }
    }
});

defendBtn.addEventListener('click', () => {
    defendAlert.style.display = "flex"
    if (weaponble) {
        showNotification("успешно защитился", false)
        defendAlert.style.display = "none"
        showStatus()
    } else {
        balance -= 10
        showNotification("-10 монет за мед помощь (купи лазер)", true)
        defendAlert.style.display = "none"
        showStatus()
    }
});

winOk.addEventListener('click', () => {
    winAlert.style.display = 'none'
    balance = 0
    weaponble = false
    inventory = {laser: 0, booster: 0, shield: 0, crystal: 0}
    showInventory()
    showStatus()
    window.close()
});

weaponBtn.addEventListener('click', () => {
    if (balance >= 500 && !weaponble) {
        balance -= 500
        weaponble = true
        inventory.laser++
        showNotification("Лазерный луч активирован!")
        showInventory()
        showStatus()

    } else if (inventory.crystal >= 17 && !weaponble) {
        inventory.crystal -= 17;
        weaponble = true
        inventory.laser++
        showNotification("Лазерный луч активирован! (за кристаллы)")
        showInventory()
        showStatus()


    } else if (weaponble) {
        showNotification("Лазерный луч уже активирован!")
    } else {
        showNotification("Не хватает монет или кристаллов")

    }
});

boosterBtn.addEventListener('click', () => {
    if (balance >= 300) {
        balance -= 300
        inventory.booster++
        boosterEffect += 0.3
        showNotification("Из всех завалявшихся пакетиков чая вы заварили со вкусом 'молотый криптон'. ВЫПИВ ЕГО ВЫ СТАЛИ РАБОТАТЬ ЭФФЕКТИВНЕЙ (+0,3 ПРИ МАЙНИНГЕ)");
        showInventory()
        showStatus()
    }
});

homeBtn.addEventListener('click', () => {
    if (balance >= 2000) {


    } else {
        showNotification(`Вам нужно набрать еще ${2000 - balance} монеток для победы`, true)
    }
});

let delivery

function startIntervals() {
    delivery = setInterval(() => {
        must = generateMust()
        showNotification(`Новая поставка: ${must} единиц`)

        showStatus()
    }, 7000);
}

setInterval(() => {
    defendAlert.style.display = 'flex';

    // наказание через 5 секунд без ответа
    setTimeout(() => {
        if (defendAlert.style.display === 'flex') {
            defendAlert.style.display = 'none'
            if (!weaponble) {
                balance -= 10
                showNotification("-10 за мед. помощь", true)

                showStatus();
                if (balance <= 0) {
                    setTimeout(lose, 1000)
                }
            }
        }
    }, 5000)
}, 30000)

setInterval(() => {
    showStatus()
}, 1000);

startIntervals()

workBtn.addEventListener('click', working)