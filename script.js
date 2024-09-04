let score = 0;
let income = 0;
let clickPower = 1;
let level = 1;
let xp = 0;
let nextLevelXp = 100;
let incomePrice = 100;
let clickPowerPrice = 50;
let achievements = [];
let quests = [
    { id: 1, name: "Сделать 100 кликов", completed: false, reward: 100 },
    { id: 2, name: "Накопить 1000 очков", completed: false, reward: 500 }
];

const scoreElement = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const passiveIncomeElement = document.getElementById('passiveIncome');
const clickPowerElement = document.getElementById('clickPower');
const achievementsElement = document.getElementById('achievements');
const bonusMessage = document.getElementById('bonusMessage');
const levelElement = document.getElementById('level');
const xpElement = document.getElementById('xp');
const leaderboardElement = document.getElementById('leaderboard');
const questListElement = document.getElementById('questList');

const buyIncomeButton = document.getElementById('buyIncome');
const buyClickPowerButton = document.getElementById('buyClickPower');
const resetButton = document.getElementById('resetButton');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
});

clickButton.addEventListener('click', () => {
    score += clickPower;
    xp += clickPower;
    updateScore();
    updateXp();
    checkLevelUp();
    checkAchievements();
    checkQuests();
    triggerRandomBonus();
});

buyIncomeButton.addEventListener('click', () => {
    if (score >= incomePrice) {
        score -= incomePrice;
        income++;
        incomePrice = Math.floor(incomePrice * 1.5);
        updateScore();
        updateIncome();
    }
});

buyClickPowerButton.addEventListener('click', () => {
    if (score >= clickPowerPrice) {
        score -= clickPowerPrice;
        clickPower++;
        clickPowerPrice = Math.floor(clickPowerPrice * 1.5);
        updateScore();
        updateClickPower();
    }
});

resetButton.addEventListener('click', () => {
    if (confirm("Вы уверены, что хотите сбросить прогресс? Вы получите бонус к доходу!")) {
        income += level;
        score = 0;
        clickPower = 1;
        level = 1;
        xp = 0;
        nextLevelXp = 100;
        incomePrice = 100;
        clickPowerPrice = 50;
        achievements = [];
        quests.forEach(q => q.completed = false);
        updateScore();
        updateIncome();
        updateClickPower();
        updateLevel();
        updateXp();
        updateAchievementsList();
        updateQuestList();
    }
});

saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);

setInterval(() => {
    score += income;
    xp += income;
    updateScore();
    updateXp();
    checkLevelUp();
    checkAchievements();
    checkQuests();
}, 1000);

function updateScore() {
    scoreElement.textContent = `Очки: ${score}`;
}

function updateIncome() {
    passiveIncomeElement.textContent = `Пассивный доход: ${income} очков/сек`;
    buyIncomeButton.textContent = `Улучшить доход (Цена: ${incomePrice} очков)`;
}

function updateClickPower() {
    clickPowerElement.textContent = `Очков за клик: ${clickPower}`;
    buyClickPowerButton.textContent = `Улучшить клик (Цена: ${clickPowerPrice} очков)`;
}

function updateLevel() {
    levelElement.textContent = `Уровень: ${level} (Опыт: ${xp}/${nextLevelXp})`;
}

function updateXp() {
    xpElement.textContent = `Опыт: ${xp}`;
}

function checkLevelUp() {
    if (xp >= nextLevelXp) {
        level++;
        xp -= nextLevelXp;
        nextLevelXp = Math.floor(nextLevelXp * 1.5);
        updateLevel();
        triggerLevelUpBonus();
    }
}

function checkAchievements() {
    if (score >= 100 && !achievements.includes('Накопить 100 очков')) {
        achievements.push('Накопить 100 очков');
        updateAchievementsList();
    }

    if (clickPower >= 10 && !achievements.includes('Увеличить клик до 10')) {
        achievements.push('Увеличить клик до 10');
        updateAchievementsList();
    }
}

function updateAchievementsList() {
    achievementsElement.innerHTML = '<p>Достижения:</p>';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementsElement.appendChild(li);
    });
}

function checkQuests() {
    quests.forEach(quest => {
        if (!quest.completed && evaluateQuest(quest)) {
            quest.completed = true;
            score += quest.reward;
            updateScore();
            updateQuestList();
        }
    });
}

function evaluateQuest(quest) {
    if (quest.id === 1 && score >= 100) return true;
    if (quest.id === 2 && score >= 1000) return true;
    return false;
}

function updateQuestList() {
    questListElement.innerHTML = '';
    quests.forEach(quest => {
        const div = document.createElement('div');
        div.className = 'quest';
        div.textContent = `${quest.name} - ${quest.completed ? 'Завершено' : 'В процессе'} (Награда: ${quest.reward} очков)`;
        questListElement.appendChild(div);
    });
}

function triggerRandomBonus() {
    if (Math.random() < 0.01) {
        const bonus = 100;
        score += bonus;
        bonusMessage.textContent = `Бонус: +${bonus} очков!`;
        bonusMessage.classList.remove('hidden');
        setTimeout(() => bonusMessage.classList.add('hidden'), 2000);
        updateScore();
    }
}

function triggerLevelUpBonus() {
    const bonus = level * 10;
    score += bonus;
    alert(`Уровень повышен! Получено бонусных очков: ${bonus}`);
    updateScore();
}

function saveGame() {
    const gameData = {
        score,
        income,
        clickPower,
        level,
        xp,
        nextLevelXp,
        incomePrice,
        clickPowerPrice,
        achievements,
        quests
    };
    localStorage.setItem('clickerGameSave', JSON.stringify(gameData));
    alert('Игра сохранена!');
}

function loadGame() {
    const savedData = localStorage.getItem('clickerGameSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        score = gameData.score;
        income = gameData.income;
        clickPower = gameData.clickPower;
        level = gameData.level;
        xp = gameData.xp;
        nextLevelXp = gameData.nextLevelXp;
        incomePrice = gameData.incomePrice;
        clickPowerPrice = gameData.clickPowerPrice;
        achievements = gameData.achievements;
        quests = gameData.quests;
        updateScore();
        updateIncome();
        updateClickPower();
        updateLevel();
        updateXp();
        updateAchievementsList();
        updateQuestList();
        alert('Игра загружена!');
    } else {
        alert('Сохраненные данные не найдены.');
    }
}

updateIncome();
updateClickPower();
updateLevel();
updateXp();
updateAchievementsList();
updateQuestList();