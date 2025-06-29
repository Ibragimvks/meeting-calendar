const calendar = document.getElementById('calendar');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const closePopupBtn = document.getElementById('close-popup');

const colorsMap = {
  "красный": "#FF0000",
  "синий": "#0000FF",
  "зелёный": "#008000",
  "жёлтый": "#FFFF00",
  "оранжевый": "#FFA500",
  "фиолетовый": "#800080",
  "чёрный": "#000000",
  "белый": "#FFFFFF"
};

// Пример данных для дней (каждый день — массив цветов по-русски)
const daysData = [
  ["красный"],
  ["синий", "зелёный"],
  ["жёлтый", "красный", "синий"],
  ["оранжевый", "фиолетовый", "зелёный", "жёлтый"],
  ["красный", "синий", "зелёный", "жёлтый", "оранжевый"],
  ["фиолетовый", "чёрный", "белый", "красный", "жёлтый", "синий"],
  ["зелёный", "оранжевый", "красный", "синий", "жёлтый", "фиолетовый", "чёрный"],
  ["красный", "синий", "зелёный", "жёлтый", "оранжевый", "фиолетовый", "чёрный", "белый"]
];

// Размер ячейки
const cellSize = 80;

function createCellParts(colors) {
  const parts = [];
  switch (colors.length) {
    case 1:
      parts.push({color: colors[0], x:0, y:0, w:cellSize, h:cellSize});
      break;
    case 2:
      parts.push({color: colors[0], x:0, y:0, w:cellSize/2, h:cellSize});
      parts.push({color: colors[1], x:cellSize/2, y:0, w:cellSize/2, h:cellSize});
      break;
    case 3:
      parts.push({color: colors[0], x:0, y:0, w:cellSize/2, h:cellSize});
      parts.push({color: colors[1], x:cellSize/2, y:0, w:cellSize/2, h:cellSize/2});
      parts.push({color: colors[2], x:cellSize/2, y:cellSize/2, w:cellSize/2, h:cellSize/2});
      break;
    case 4:
      parts.push({color: colors[0], x:0, y:0, w:cellSize/2, h:cellSize/2});
      parts.push({color: colors[1], x:cellSize/2, y:0, w:cellSize/2, h:cellSize/2});
      parts.push({color: colors[2], x:0, y:cellSize/2, w:cellSize/2, h:cellSize/2});
      parts.push({color: colors[3], x:cellSize/2, y:cellSize/2, w:cellSize/2, h:cellSize/2});
      break;
    case 5:
      const third = cellSize / 3;
      parts.push({color: colors[0], x:0, y:0, w:third, h:cellSize});
      parts.push({color: colors[1], x:third, y:0, w:third/2, h:cellSize/2});
      parts.push({color: colors[2], x:third + third/2, y:0, w:third/2, h:cellSize/2});
      parts.push({color: colors[3], x:third, y:cellSize/2, w:third/2, h:cellSize/2});
      parts.push({color: colors[4], x:third + third/2, y:cellSize/2, w:third/2, h:cellSize/2});
      break;
    case 6:
      const thirdWidth = cellSize / 3;
      const halfHeight = cellSize / 2;
      for (let i=0; i<3; i++) {
        parts.push({color: colors[2*i], x: i*thirdWidth, y:0, w:thirdWidth, h:halfHeight});
        parts.push({color: colors[2*i+1], x: i*thirdWidth, y:halfHeight, w:thirdWidth, h:halfHeight});
      }
      break;
    case 7:
      const quarter = cellSize / 4;
      const halfH = cellSize / 2;
      parts.push({color: colors[0], x:0, y:0, w:quarter, h:cellSize});
      for(let i=1; i<=3; i++) {
        parts.push({color: colors[2*i-1], x:i*quarter, y:0, w:quarter, h:halfH});
        parts.push({color: colors[2*i], x:i*quarter, y:halfH, w:quarter, h:halfH});
      }
      break;
    case 8:
      const quarterW = cellSize / 4;
      const halfH8 = cellSize / 2;
      for(let i=0; i<4; i++) {
        parts.push({color: colors[2*i], x:i*quarterW, y:0, w:quarterW, h:halfH8});
        parts.push({color: colors[2*i+1], x:i*quarterW, y:halfH8, w:quarterW, h:halfH8});
      }
      break;
    default:
      // если больше 8, отрисуем только первые 8 по схеме для 8
      const quarterDef = cellSize / 4;
      const halfDef = cellSize / 2;
      for(let i=0; i<8; i++) {
        parts.push({color: colors[i], x:(i>>1)*quarterDef, y:(i%2)*halfDef, w:quarterDef, h:halfDef});
      }
      break;
  }
  return parts;
}

function createDayCell(dayIndex, colors) {
  const cell = document.createElement('canvas');
  cell.width = cellSize;
  cell.height = cellSize;
  cell.className = 'day-cell';
  const ctx = cell.getContext('2d');

  const parts = createCellParts(colors);

  parts.forEach(part => {
    ctx.fillStyle = colorsMap[part.color] || '#888888';
    ctx.fillRect(part.x, part.y, part.w, part.h);
  });

  cell.addEventListener('click', () => {
    showPopup(colors);
  });

  return cell;
}

function showPopup(colors) {
  popupContent.innerHTML = colors.map(c => `• ${c}`).join('<br>');
  popup.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Заполняем календарь примерами дней
daysData.forEach((colors, index) => {
  calendar.appendChild(createDayCell(index, colors));
});
