const gematriaMap = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
};

// פונקציה לחישוב גימטרייה של מילה
function calculateWordGematria(word) {
    return word.split('').reduce((sum, char) => sum + (gematriaMap[char] || 0), 0);
}

// חישוב גימטרייה של השם והצגת התוצאות
function calculateGematria() {
    const name = document.getElementById('inputName').value.trim();
    if (!name) return;

    const gematriaResults = document.getElementById('gematriaResults');
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');

    gematriaResults.innerHTML = "";
    complimentsResults.innerHTML = "";
    loading.style.display = "block";

    let totalGematria = 0;

    name.split('').forEach(char => {
        if (gematriaMap[char]) {
            const charGematria = gematriaMap[char];
            totalGematria += charGematria;
            const p = document.createElement("p");
            p.textContent = `${char} = ${charGematria}`;
            gematriaResults.appendChild(p);
        }
    });

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>סך הכל גימטרייה: ${totalGematria}</strong>`;
    gematriaResults.appendChild(totalP);

    fetch("compliments.txt")
        .then(response => response.text())
        .then(text => findMatchingCompliments(text, totalGematria))
        .catch(error => {
            console.error("שגיאה בטעינת המחמאות", error);
            loading.style.display = "none";
        });
}

// חיפוש מחמאות תואמות
function findMatchingCompliments(text, targetGematria) {
    const loading = document.getElementById('loading');
    const complimentsResults = document.getElementById('complimentsResults');

    let compliments = text.split("\n").map(line => line.trim()).filter(Boolean);
    let found = false;

    for (let i = 0; i < compliments.length; i++) {
        let words = [compliments[i]];
        let sum = calculateWordGematria(compliments[i]);

        for (let j = i + 1; j < compliments.length; j++) {
            sum += calculateWordGematria("ו") + calculateWordGematria(compliments[j]);
            words.push("ו" + compliments[j]);

            if (sum === targetGematria) {
                const p = document.createElement("p");
                p.innerHTML = `<strong>${words.join(" ")}</strong>`;
                complimentsResults.appendChild(p);
                found = true;
            }
        }
    }

    if (!found) {
        complimentsResults.innerHTML = "<p>לא נמצאו מחמאות תואמות</p>";
    }

    loading.style.display = "none";
}
