const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popupContent');
const closePopup = document.getElementById('closePopup');

let currentDate = new Date();

const rusColors = {
  red: 'Красный',
  blue: 'Синий',
  green: 'Зелёный',
  purple: 'Фиолетовый',
  orange: 'Оранжевый',
  pink: 'Розовый',
  cyan: 'Голубой',
  yellow: 'Жёлтый',
  brown: 'Коричневый',
  gray: 'Серый',
};

function loadVotes(dateKey) {
  return JSON.parse(localStorage.getItem(dateKey) || "[]");
}

function saveVote(dateKey, vote) {
  const votes = loadVotes(dateKey);
  const existing = votes.find(v => v.name === vote.name);
  if (existing) return;
  votes.push(vote);
  localStorage.setItem(dateKey, JSON.stringify(votes));
}

function clearCalendar() {
  calendar.innerHTML = '';
}

function createEmptyCells(count) {
  for(let i=0; i<count; i++) {
    const cell = document.createElement('div');
    cell.classList.add('empty-cell');
    calendar.appendChild(cell);
  }
}

function createDayCell(day, year, month) {
  const dateKey = `${year}-${month+1}-${day}`;
  const votes = loadVotes(dateKey);

  const cell = document.createElement('div');
  cell.classList.add('day-cell');
  cell.style.position = 'relative';

  const dayNumber = document.createElement('div');
  dayNumber.textContent = day;
  dayNumber.style.position = 'absolute';
  dayNumber.style.top = '2px';
  dayNumber.style.left = '2px';
  dayNumber.style.fontSize = '14px';
  dayNumber.style.fontWeight = 'bold';
  cell.appendChild(dayNumber);

  const colorBox = document.createElement('div');
  colorBox.style.width = '100%';
  colorBox.style.height = '100%';
  colorBox.style.display = 'grid';
  colorBox.style.position = 'absolute';
  colorBox.style.top = '0';
  colorBox.style.left = '0';
  colorBox.style.zIndex = '0';
  cell.appendChild(colorBox);

  // Рисуем цвета согласно логике
  drawColors(colorBox, votes.map(v => v.color));

  // При клике показываем popup с именами, статусом и цветами на русском
  cell.addEventListener('click', () => {
    if (votes.length === 0) {
      popupContent.textContent = `День ${day} — голосов нет`;
    } else {
      const rusStatus = s => s === "free" ? "Свободен" : "Занят";
      let text = `День ${day}:\n`;
      for (const v of votes) {
        text += `${v.name} — ${rusStatus(v.status)} — ${rusColors[v.color] || v.color}\n`;
      }
      popupContent.textContent = text.trim();
    }
    popup.classList.remove('hidden');
  });

  return cell;
}

function drawColors(container, colors) {
  const n = colors.length;
  container.innerHTML = '';

  // Стили для разных случаев:
  // 1 цвет: один блок на весь контейнер
  // 2 цвета: два блока по 50% ширины
  // 3 цвета: первый цвет занимает 50% слева, остальные два сверху и снизу справа по 25%
  // 4 цвета: делим контейнер на 4 равных квадрата (плюс)
  // 5 цветов: делим на 3 вертикальных части, первая занимает 1/3 полностью, остальные 4 цвета делятся по двум половинам справа
  // 6 цветов: 3 вертикальных части, каждая из которых разбита по горизонтали пополам (итого 6 частей)
  // 7 цветов: 4 части (2x2), первая полностью, остальные три делятся по горизонтали пополам
  // 8 цветов: 4 части (2x2), каждая из которых разбита по горизонтали пополам (итого 8 частей)
  // 9+ цветов: 3x3 сетка

  if (n === 0) return;

  if (n === 1) {
    const div = document.createElement('div');
    div.style.gridArea = '1 / 1 / 2 / 2';
    div.style.backgroundColor = colors[0];
    container.style.gridTemplate = '1fr / 1fr';
    container.appendChild(div);
  } else if (n === 2) {
    container.style.gridTemplate = '1fr / 1fr 1fr';
    for (let i = 0; i < 2; i++) {
      const div = document.createElement('div');
      div.style.backgroundColor = colors[i];
      div.style.gridColumn = i + 1;
      container.appendChild(div);
    }
  } else if (n === 3) {
    container.style.gridTemplate = '1fr / 2fr 1fr';
    // Первый цвет - слева 50%
    const leftDiv = document.createElement('div');
    leftDiv.style.backgroundColor = colors[0];
    leftDiv.style.gridColumn = '1';
    container.appendChild(leftDiv);

    // Два других цвета делятся справа по вертикали (пополам)
    const rightContainer = document.createElement('div');
    rightContainer.style.display = 'grid';
    rightContainer.style.gridTemplateRows = '1fr 1fr';
    rightContainer.style.gridColumn = '2';
    rightContainer.style.height = '100%';

    for (let i = 1; i < 3; i++) {
      const d = document.createElement('div');
      d.style.backgroundColor = colors[i];
      rightContainer.appendChild(d);
    }
    container.appendChild(rightContainer);
  } else if (n === 4) {
    container.style.gridTemplate = '1fr 1fr / 1fr 1fr';
    for (let i = 0; i < 4; i++) {
      const div = document.createElement('div');
      div.style.backgroundColor = colors[i];
      div.style.gridRow = Math.floor(i / 2) + 1;
      div.style.gridColumn = (i % 2) + 1;
      container.appendChild(div);
    }
  } else if (n === 5) {
    // 3 равные вертикальные части
    container.style.gridTemplate = '1fr / 1fr 1fr 1fr';

    // Первый цвет занимает всю первую треть
    const firstDiv = document.createElement('div');
    firstDiv.style.backgroundColor = colors[0];
    firstDiv.style.gridColumn = '1';
    firstDiv.style.gridRow = '1';
    container.appendChild(firstDiv);

    // Правая часть разбита на 2 колонки и 2 строки (4 части)
    const rightContainer = document.createElement('div');
    rightContainer.style.gridColumn = '2 / span 2';
    rightContainer.style.gridRow = '1';
    rightContainer.style.display = 'grid';
    rightContainer.style.gridTemplateColumns = '1fr 1fr';
    rightContainer.style.gridTemplateRows = '1fr 1fr';

    for (let i = 1; i < 5; i++) {
      const d = document.createElement('div');
      d.style.backgroundColor = colors[i];
      d.style.border = '1px solid white';
      rightContainer.appendChild(d);
    }
    container.appendChild(rightContainer);
  } else if (n === 6) {
    // 3 колонки, каждая делится пополам по вертикали (6 частей)
    container.style.gridTemplate = '1fr 1fr / 1fr 1fr 1fr';
    for (let i = 0; i < 6; i++) {
      const div = document.createElement('div');
      div.style.backgroundColor = colors[i];
      div.style.gridRow = (i % 2) + 1;
      div.style.gridColumn = Math.floor(i / 2) + 1;
      container.appendChild(div);
    }
  } else if (n === 7) {
    // 4 части: 2 строки х 2 колонки
    container.style.gridTemplate = '1fr 1fr / 1fr 1fr';

    // Первый цвет занимает первую ячейку полностью
    const firstDiv = document.createElement('div');
    firstDiv.style.backgroundColor = colors[0];
    firstDiv.style.gridRow = '1';
    firstDiv.style.gridColumn = '1';
    container.appendChild(firstDiv);

    // Остальные 3 цвета делятся пополам по горизонтали в оставшихся 3 ячейках
    for (let i = 1; i < 7; i++) {
      const parentCellIndex = i; // 1..6
      const parentRow = Math.floor(parentCellIndex / 2) + 1;
      const parentCol = (parentCellIndex % 2) + 1;

      const parentDiv = document.createElement('div');
      parentDiv.style.gridRow = parentRow;
      parentDiv.style.gridColumn = parentCol;
      parentDiv.style.display = 'grid';
      parentDiv.style.gridTemplateRows = '1fr 1fr';

      // два цвета в этом parentDiv (по одному на ячейку)
      for (let j = 0; j < 2; j++) {
        const d = document.createElement('div');
        d.style.backgroundColor = colors[i + j];
        parentDiv.appendChild(d);
      }
      container.appendChild(parentDiv);
      i++; // пропускаем следующий цвет, так как нарисовали 2 цвета
    }
  } else if (n === 8) {
    // 4 части 2x2, каждая разбита по горизонтали пополам (итого 8)
    container.style.gridTemplate = '1fr 1fr / 1fr 1fr';
    for (let i = 0; i < 8; i++) {
      const parentRow = Math.floor(i / 4) + 1;
      const parentCol = ((i % 4) >= 2) ? 2 : 1;

      // Для 8 частей делаем 4 контейнера с 2 частями в каждом
      if (i % 2 === 0) {
        const parentDiv = document.createElement('div');
        parentDiv.style.gridRow = Math.floor(i / 4) + 1;
        parentDiv.style.gridColumn = (Math.floor((i % 4) / 2)) + 1;
        parentDiv.style.display = 'grid';
        parentDiv.style.gridTemplateRows = '1fr 1fr';
        parentDiv.dataset.id = Math.floor(i / 2);
        container.appendChild(parentDiv);
      }
      const parentDiv = container.querySelector(`div[data-id='${Math.floor(i / 2)}']`);
      const d = document.createElement('div');
      d.style.backgroundColor = colors[i];
      parentDiv.appendChild(d);
    }
  } else {
    // 9 и больше: простая сетка 3x3 с цветами
    const gridSize = Math.ceil(Math.sqrt(n));
    container.style.gridTemplate = `${gridSize}fr / ${gridSize}fr`;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.style.backgroundColor = colors[i];
      container.appendChild(d);
    }
  }
}

function renderCalendar() {
  clearCalendar();

  // Показываем месяц и год
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  // Первый день месяца (0 = воскресенье)
  const firstDay = new Date(year, month, 1).getDay();
  // Сдвигаем, чтобы понедельник был первым днём недели (0=понедельник)
  const startDay = (firstDay === 0) ? 6 : firstDay - 1;

  // Количество дней в месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  createEmptyCells(startDay);

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = createDayCell(day, year, month);
    calendar.appendChild(cell);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

closePopup.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Инициализация
renderCalendar();
