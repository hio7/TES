const scoreTable = document.getElementById("scoreTable");
const matches = [];

// 建立 3 回合輸入欄位
for (let i = 1; i <= 3; i++) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${i}</td>
    <td><input type="number" id="rp${i}" value="0"></td>
    <td><input type="number" id="rch${i}" value="0"></td>
    <td><input type="number" id="rpen${i}" value="0"></td>
    <td><input type="number" id="wp${i}" value="0"></td>
    <td><input type="number" id="wch${i}" value="0"></td>
    <td><input type="number" id="wpen${i}" value="0"></td>
  `;
  scoreTable.appendChild(row);
}

function calculateTotal(prefix) {
  let total = 0;
  for (let i = 1; i <= 3; i++) {
    const points = parseInt(document.getElementById(`${prefix}p${i}`).value) || 0;
    const hits = parseInt(document.getElementById(`${prefix}ch${i}`).value) || 0;
    const penalties = parseInt(document.getElementById(`${prefix}pen${i}`).value) || 0;
    total += (points + hits - penalties);
  }
  return total;
}

function calculateWinner() {
  const redTotal = calculateTotal('r');
  const whiteTotal = calculateTotal('w');

  let result = "Match 1 Winner: ";
  if (redTotal > whiteTotal) {
    result += "Red";
  } else if (whiteTotal > redTotal) {
    result += "White";
  } else {
    result += "Draw";
  }

  document.getElementById("result").textContent = `${result} (Red: ${redTotal}, White: ${whiteTotal})`;
}

function addMatch() {
  const redTotal = calculateTotal('r');
  const whiteTotal = calculateTotal('w');
  const winner = redTotal > whiteTotal ? 'Red' :
                 whiteTotal > redTotal ? 'White' : 'Draw';

  const matchData = {
    match: matches.length + 1,
    redScore: redTotal,
    whiteScore: whiteTotal,
    winner: winner
  };

  matches.push(matchData);

  const li = document.createElement('li');
  li.textContent = `Match ${matchData.match}: Red ${redTotal}, White ${whiteTotal} → Winner: ${winner}`;
  document.getElementById("matchList").appendChild(li);
}

function exportCSV() {
  if (matches.length === 0) {
    alert("沒有比賽紀錄！");
    return;
  }

  const headers = "Match,Red Score,White Score,Winner\\n";
  const rows = matches.map(m => `${m.match},${m.redScore},${m.whiteScore},${m.winner}`).join("\\n");
  const csvContent = headers + rows;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "match_results.csv";
  a.click();
  URL.revokeObjectURL(url);
}
