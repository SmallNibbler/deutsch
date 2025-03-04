class Database {

    static async load() {
        const instance = new Database();
        instance.data = JSON.parse(localStorage.getItem("data"));
        instance.modifiers = JSON.parse(localStorage.getItem("modifiers"));
        if (!instance.data) {
            try {
                const response = await fetch('../database.json');
                instance.data = await response.json();
                localStorage.setItem("data", JSON.stringify(instance.data));
            } catch (error) {
                console.error('Ошибка:', error);
                return null; // Или другое значение по умолчанию
            }
        }
        if (!instance.modifiers) instance.modifiers = {};
        return instance;
    }
    
    // Функция для получения случайной пары с учетом модификатора
    getRelevantExercise() {
        const pairs = Object.entries(this.data);

        // Вычисляем общий вес пар на основе модификатора
        const totalWeight = pairs.reduce((sum, pair) => sum + this.getModifier(pair[1]), 0);
        let rand = Math.random() * totalWeight;
        for (let pair of pairs) {
            rand -= this.getModifier(pair[1]);
            if (rand < 0) return pair;
        }
    }

    // Функция для сохранения модификатора в localStorage
    setModifier(word, modifier) {
        this.modifiers[word] = modifier;
        localStorage.setItem("modifiers", JSON.stringify(this.modifiers));
    }

    // Функция для получения модификатора из localStorage
    getModifier(word) {
        return Number(this.modifiers[word]) || 10;
    }

    addWord(word, translation) {
        this.data[word] = translation;
        localStorage.setItem("data", JSON.stringify(this.data));
    }

    removeWord(word) {
        delete this.data[word];
        localStorage.setItem("data", JSON.stringify(this.data));
    }
}

const database = await Database.load();
export default database;

/*let database = await loadDatabase();
export default database;

// Функция для загрузки данных из database.json
async function loadDatabase() {
    const response = await fetch('../database.json');
    const data = await response.json();
    return {
        data: data,

        // Функция для получения случайной пары с учетом модификатора
        getRelevantExercise() {
            const pairs = Object.entries(this.data);

            // Вычисляем общий вес пар на основе модификатора
            const totalWeight = pairs.reduce((sum, pair) => sum + this.getModifier(pair[1]), 0);
            let rand = Math.random() * totalWeight;
            for (let pair of pairs) {
                rand -= this.getModifier(pair[1]);
                if (rand < 0) return pair;
            }
        },

        // Функция для сохранения модификатора в localStorage
        saveModifier(word, modifier) {
            localStorage.setItem(word, modifier);
        },

        // Функция для получения модификатора из localStorage
        getModifier(word) {
            return Number(localStorage.getItem(word)) || 10; // По умолчанию модификатор равен 1
        }
    };
}*/