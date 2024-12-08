let rarity = 'legendary';
fetch('item.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const item = data.pageProps ? data.pageProps.item : null;
        if (!item) {
            throw new Error('Item não encontrado no JSON');
        }

        const mainTitle = document.querySelector('.main-item-board-container h1');
        if (mainTitle) {
            mainTitle.textContent = item.name;
        }
    
        const container = document.getElementById('item-container');
        container.innerHTML = renderItem(item);
        adjustStatEnd();
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));

function renderItem(item) {

    let html = `
    <div class="item-card-tier">
        <div class="item-card-box">
            <div class="item-card open_modal_wrapper">
                <img class="cover ${rarity}" src="https://cdn.ashescodex.com${item.icon_url}_64.webp" alt="${item.name}">
                <div class="item-card-content">
                    <div class="item-card-header ${rarity}">
                        <div class="box-image">
                            <img class="thumb" src="https://cdn.ashescodex.com${item.icon_url}_64.webp" alt="${item.name}">
                        </div>
                        <div class="right-content">
                            <h3>${item.name}</h3>
                            <span>${item.type || 'Unknown Type'}</span>
                        </div>
                    </div>

                    ${item.stats && Array.isArray(item.stats) && item.stats.length > 0 && item.stats.some(stat => stat.statName && stat.statName !== 'null') ? `
                    <ul>
                        ${item.stats.filter(stat => stat.statName && stat.statName !== 'Max Durability').map(stat => {
                            const statMin = stat[`${rarity}Min`];
                            const statMax = stat[`${rarity}Max`];
                            return statMin ? `<li><span>${statMin} ${statMax ? `- ${statMax}` : ''}</span> ${stat.statName}</li>` : '';
                        }).join('')}
                    </ul>` : ''}
                    
                    ${item.secondaryStats && Array.isArray(item.secondaryStats) && item.secondaryStats.length > 0 && item.secondaryStats.some(stat => stat.statName && stat.statName !== 'null') ? `
                    <ul class="sec">
                        ${item.secondaryStats.filter(stat => stat.statName && stat.statName !== 'Max Durability').map(stat => {
                            const statMin = stat[`${rarity}Min`];
                            const statMax = stat[`${rarity}Max`];
                            return statMin ? `<li><span>${statMin} ${statMax ? `- ${statMax}` : ''}</span> ${stat.statName}</li>` : '';
                        }).join('')}
                    </ul>` : ''}
                    
                    <div class="info">${item.description || 'No description available.'}</div>
                    <ul class="stats">
                        <li>Required Level - ${item.minimumLevel || 'N/A'}</li>
                        ${item.stats.filter(stat => stat.statName && stat.statName === 'Max Durability').map(stat => {
                            const statMin = stat[`${rarity}Min`];
                            return statMin ? `<li>Durability - ${statMin}</li>` : '';
                        }).join('')}
                    </ul>
                </div>
            </div>
    </div>`;

    if (item.recipe && Array.isArray(item.recipe) && item.recipe.length > 0) {
        html += `<div class="clear"></div>`;
        item.recipe.forEach(subItem => {
            if (subItem.subMaterials && Array.isArray(subItem.subMaterials) && subItem.subMaterials.length > 0) {
                html += renderItem(subItem.subMaterials[0]);
            }
        });
    }

    html += `</div>`;

    return html;
}

function adjustStatEnd() {
    document.querySelectorAll('.item-card-tier').forEach(parent => {
        const firstChild = parent.querySelector('.item-card-tier');
        if (firstChild) {
            firstChild.classList.add('first-child');
        }
    });

    document.querySelectorAll('.item-card-tier:last-of-type').forEach(lastChild => {
        lastChild.classList.add('last-child');
    });
}


// Board
const content = document.getElementById("content");
const viewport = document.getElementById("viewport");

let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

const contentWidth = 2000;
const contentHeight = 2000;
const viewportWidth = 500;
const viewportHeight = 500;

const maxLeft = 0;
const minLeft = viewportWidth - contentWidth;
const maxTop = 0;
const minTop = viewportHeight - contentHeight;

viewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  viewport.style.cursor = "grabbing";
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

 
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

 
  let newLeft = Math.max(minLeft, Math.min(maxLeft, offsetX + dx));
  let newTop = Math.max(minTop, Math.min(maxTop, offsetY + dy));

 
  content.style.left = `${newLeft}px`;
  content.style.top = `${newTop}px`;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    viewport.style.cursor = "grab";

   
    const computedStyle = window.getComputedStyle(content);
    offsetX = parseInt(computedStyle.left, 10);
    offsetY = parseInt(computedStyle.top, 10);
  }
});