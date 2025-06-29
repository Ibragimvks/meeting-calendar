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

const cellSize = 80;

// Функция создаёт части ячейки с координатами и размерами для раскраски по правилам
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
      const half = cellSize / 2;
      parts.push({color: colors[0], x:0, y:0, w:half, h:half});
      parts.push({color: colors[1], x:half, y:0, w:half, h:half});
      parts.push({color: colors[2], x:0, y:half, w:half, h:half});
      parts.push({color: colors[3], x:half, y:half, w:half, h:half});
      break;
    case 5:
      const third = cellSize / 3;
      parts.push({color: colors[0], x:0, y:0, w:third, h:cellSize});
      const rightWidth = cellSize - third;
      const halfHeight = cellSize / 2;
      parts.push({color: colors[1], x:third, y:0, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[2], x:third + rightWidth/2, y:0, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[3], x:third, y:halfHeight, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[4], x:third + rightWidth/2, y:halfHeight, w:rightWidth/2, h:halfHeight});
      break;
    case 6:
      const thirdW = cellSize / 3;
      const halfH = cellSize / 2;
      for (let i=0; i<3; i++) {
        parts.push({color: colors[2*i], x:i*thirdW, y:0, w:thirdW, h:halfH});
        parts.push({color: colors[2*i+1], x:i*thirdW, y:halfH, w:thirdW, h:halfH});
      }
      break;
    case 7:
      const quarter = cellSize / 4;
      const halfHeight7 = cellSize / 2;
      parts.push({color: colors[0], x:0, y:0, w:quarter, h:cellSize});
      for(let i=1; i<=3; i++) {
        parts.push({color: colors[2*i-1], x:i*quarter, y:0, w:quarter, h:halfHeight7});
        parts.push({color: colors[2*i], x:i*quarter, y:halfHeight7, w:quarter, h:halfHeight7});
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
      const qW = cellSize / 4;
      const hH = cellSize / 2;
      for(let i=0; i<8; i++) {
        parts.push({color: colors[i], x:(i>>1)*qW, y:(i%2)*hH, w:qW, h:hH});
      }
      break;
  }
  return parts;
}

// Создаём canvas для дня, раскрашиваем согласно цветам, добавляем обработчик клика
function createDayCell(dayNum, colors) {
  const cell = document.createElement('canvas');
  cell.width = cellSize;
  cell.height = cellSize;
  cell.className = 'day-cell';
  const ctx = cell.getContext('2d');

  // Белый фон
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, cellSize, cellSize);

  // Рисуем раскраску по цветам
  if(colors && colors.length > 0) {
    const parts = createCellParts(colors);
    parts.forEach(part => {
      ctx.fillStyle = colorsMap[part.color] || '#888888';
      ctx.fillRect(part.x, part.y, part.w, part.h);
    });
  }

  // Добавляем номер дня
  ctx.fillStyle = "#000000";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(dayNum, cellSize - 5, 5);

  cell.addEventListener('click', () => {
    if(colors && colors.length > 0) {
      showPopup(colors, dayNum);
    } else {
      showPopup(["нет данных"], dayNum);
    }
  });

  return cell;
}

// Показываем всплывающее окно с цветами на русском списком
function showPopup(colors, dayNum) {
  popupContent.innerHTML = `<b>День ${dayNum}</b><br>` + colors.map(c => `• ${c}`).join('<br>');
  popup.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Функция получает данные по цветам для каждого дня (здесь заглушка, заменить на реальное получение)
function getColorsForDay(day) {
  // Здесь должна быть логика получения цветов для конкретного дня, например из базы или API.
  // Для примера возвращаем рандом 1-4 цвета из списка:
  const allColors = Object.keys(colorsMap);
  const count = Math.floor(Math.random() * 5) + 1; // от 1 до 5 цветов
  const result = [];
  while(result.length < count) {
    const col = allColors[Math.floor(Math.random() * allColors.length)];
    if(!result.includes(col)) result.push(col);
  }
  return result;
}

// Рендерим календарь для текущего месяца
function renderCalendar() {
  calendar.innerHTML = '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // День недели первого дня (0 = воскресенье, 1 = понедельник ...)
  let startWeekDay = firstDay.getDay();
  // Для российского календаря считаем неделю с понедельника: сдвигаем, если воскресенье (0) ставим 6, иначе -1
  startWeekDay = (startWeekDay === 0) ? 6 : startWeekDay -1;

  // Добавляем пустые ячейки перед первым днем
  for(let i=0; i<startWeekDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'empty-cell';
    emptyCell.style.width = `${cellSize}px`;
    emptyCell.style.height = `${cellSize}px`;
    calendar.appendChild(emptyCell);
  }

  // Добавляем дни месяца с цветами
  for(let day=1; day<=daysInMonth; day++) {
    const colors = getColorsForDay(day);
    calendar.appendChild(createDayCell(day, colors));
  }
}

renderCalendar();
