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
  ["красный"], // 1 цвет
  ["синий", "зелёный"], // 2 цвета
  ["жёлтый", "красный", "синий"], // 3 цвета
  ["оранжевый", "фиолетовый", "зелёный", "жёлтый"], // 4 цвета
  ["красный", "синий", "зелёный", "жёлтый", "оранжевый"], // 5 цветов
  ["фиолетовый", "чёрный", "белый", "красный", "жёлтый", "синий"], // 6 цветов
  ["зелёный", "оранжевый", "красный", "синий", "жёлтый", "фиолетовый", "чёрный"], // 7 цветов
  ["красный", "синий", "зелёный", "жёлтый", "оранжевый", "фиолетовый", "чёрный", "белый"] // 8 цветов
];

// Размер ячейки календаря
const cellSize = 80;

// Функция создаёт части ячейки с координатами и размерами для раскраски по правилам
function createCellParts(colors) {
  const parts = [];
  switch (colors.length) {
    case 1:
      // Один цвет — заливка полностью
      parts.push({color: colors[0], x:0, y:0, w:cellSize, h:cellSize});
      break;
    case 2:
      // Два цвета — делим ячейку по вертикали пополам
      parts.push({color: colors[0], x:0, y:0, w:cellSize/2, h:cellSize});
      parts.push({color: colors[1], x:cellSize/2, y:0, w:cellSize/2, h:cellSize});
      break;
    case 3:
      // Три цвета:
      // 1-й цвет — половина по вертикали слева
      parts.push({color: colors[0], x:0, y:0, w:cellSize/2, h:cellSize});
      // 2-й и 3-й делят правую половину горизонтально пополам
      parts.push({color: colors[1], x:cellSize/2, y:0, w:cellSize/2, h:cellSize/2});
      parts.push({color: colors[2], x:cellSize/2, y:cellSize/2, w:cellSize/2, h:cellSize/2});
      break;
    case 4:
      // Четыре цвета — делим ячейку на 4 равных квадрата (плюс)
      const half = cellSize / 2;
      parts.push({color: colors[0], x:0, y:0, w:half, h:half});
      parts.push({color: colors[1], x:half, y:0, w:half, h:half});
      parts.push({color: colors[2], x:0, y:half, w:half, h:half});
      parts.push({color: colors[3], x:half, y:half, w:half, h:half});
      break;
    case 5:
      // Пять цветов:
      // Делим ширину на 3 части (треть, треть, треть)
      // Первый цвет занимает полностью левую треть (по высоте вся)
      const third = cellSize / 3;
      parts.push({color: colors[0], x:0, y:0, w:third, h:cellSize});
      // Остальные 4 цвета делятся на правые две трети (2/3 ширины)
      // Каждая из двух частей (2/3 ширины) делится по вертикали пополам
      const rightWidth = cellSize - third; // 2/3 ширины
      const halfHeight = cellSize / 2;
      // В правой части создаём 4 части:
      parts.push({color: colors[1], x:third, y:0, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[2], x:third + rightWidth/2, y:0, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[3], x:third, y:halfHeight, w:rightWidth/2, h:halfHeight});
      parts.push({color: colors[4], x:third + rightWidth/2, y:halfHeight, w:rightWidth/2, h:halfHeight});
      break;
    case 6:
      // Шесть цветов:
      // Делим ширину на 3 равные части
      // Каждая часть делится по вертикали пополам
      const thirdW = cellSize / 3;
      const halfH = cellSize / 2;
      for (let i=0; i<3; i++) {
        parts.push({color: colors[2*i], x:i*thirdW, y:0, w:thirdW, h:halfH});
        parts.push({color: colors[2*i+1], x:i*thirdW, y:halfH, w:thirdW, h:halfH});
      }
      break;
    case 7:
      // Семь цветов:
      // Делим ширину на 4 части
      // Первая часть занимает весь столбец по высоте
      const quarter = cellSize / 4;
      const halfHeight7 = cellSize / 2;
      parts.push({color: colors[0], x:0, y:0, w:quarter, h:cellSize});
      // Остальные 6 цветов распределяем по 3 колонкам справа,
      // в каждой колонке делим по вертикали пополам
      for(let i=1; i<=3; i++) {
        parts.push({color: colors[2*i-1], x:i*quarter, y:0, w:quarter, h:halfHeight7});
        parts.push({color: colors[2*i], x:i*quarter, y:halfHeight7, w:quarter, h:halfHeight7});
      }
      break;
    case 8:
      // Восемь цветов:
      // Делим ширину на 4 части
      // В каждой части делим по вертикали пополам
      const quarterW = cellSize / 4;
      const halfH8 = cellSize / 2;
      for(let i=0; i<4; i++) {
        parts.push({color: colors[2*i], x:i*quarterW, y:0, w:quarterW, h:halfH8});
        parts.push({color: colors[2*i+1], x:i*quarterW, y:halfH8, w:quarterW, h:halfH8});
      }
      break;
    default:
      // Если больше 8 цветов — отрисовываем первые 8 по схеме для 8
      const qW = cellSize / 4;
      const hH = cellSize / 2;
      for(let i=0; i<8; i++) {
        parts.push({color: colors[i], x:(i>>1)*qW, y:(i%2)*hH, w:qW, h:hH});
      }
      break;
  }
  return parts;
}

// Создаём элемент canvas для дня, раскрашиваем согласно цветам, добавляем обработчик клика
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

// Показываем всплывающее окно с цветами на русском списком
function showPopup(colors) {
  popupContent.innerHTML = colors.map(c => `• ${c}`).join('<br>');
  popup.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Рендерим календарь: создаём ячейки для всех дней из daysData
function renderCalendar() {
  calendar.innerHTML = ''; // очищаем перед отрисовкой
  daysData.forEach((colors, index) => {
    calendar.appendChild(createDayCell(index, colors));
  });
}

renderCalendar();
