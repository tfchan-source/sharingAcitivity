// --------------------------
// SHARE SECTION (DRAG & DROP) + DYNAMIC COLUMN WIDTH + GROUP COUNTERS
// --------------------------
let sharingItems = [];
let sharingGroups = [];

// Calculate dynamic column width (updated for horizontal layout)
function calculateDynamicColumnWidth(groupCount) {
    // For horizontal layout (2 pencils per row), width = 2 pencils + gap
    const pencilWidth = 80; // Pencil width (matches CSS)
    const gapBetweenPencils = 10; // Gap inside group (matches CSS)
    const groupWidth = (pencilWidth * 2) + gapBetweenPencils;
    
    // Optional: Ensure groups don't get too wide on large screens
    const maxGroupWidth = window.innerWidth * 0.2; // Max 20% of screen width per group
    return Math.min(groupWidth, maxGroupWidth);
}

// 🔥 New: Update group counter display
function updateGroupCounters() {
    // Loop through each group and update its counter
    sharingGroups.forEach((group, index) => {
        const counterElement = document.querySelector(`.group[data-index="${index}"] + .group-counter`);
        if (counterElement) {
            counterElement.textContent = `${group.length}`;
        }
    });
}

// Initialize sharing section with dynamic columns + counters
function initSharing() {
    if (!document.getElementById('sharing-items')) return;
    
    const itemCount = parseInt(document.getElementById('item-count-sharing').value) || 3;
    const groupCount = parseInt(document.getElementById('group-count-sharing').value) || 3;
    
    // Reset arrays
    sharingItems = [];
    sharingGroups = Array(groupCount).fill().map(() => []);
    
    // Clear DOM elements
    const itemsContainer = document.getElementById('sharing-items');
    const groupsContainer = document.getElementById('sharing-groups');
    itemsContainer.innerHTML = '';
    groupsContainer.innerHTML = '';
    document.getElementById('sharing-result').textContent = '';
    
    // Calculate dynamic column width
    const columnWidth = calculateDynamicColumnWidth(groupCount);
    const gapBetweenColumns = window.innerWidth * 0.015; // 1.5% of screen width
    
    // Set gap for the group container (CSS gap property)
    groupsContainer.style.gap = `${gapBetweenColumns}px`;
    
    // Create draggable items (pencils)
    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.draggable = true;
        item.textContent = '🍭';
        item.dataset.id = i;
        
        // Drag event listeners
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', i);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            updateSharingResult();
            updateGroupCounters(); // 🔥 Update counters after drag
        });
        
        itemsContainer.appendChild(item);
        sharingItems.push(i);
    }
    
    // Create dynamic columns (with calculated width) + counters
    for (let i = 0; i < groupCount; i++) {
        // Create group wrapper (to hold group + counter)
        const groupWrapper = document.createElement('div');
        groupWrapper.className = 'group-wrapper';
        groupWrapper.style.display = 'flex';
        groupWrapper.style.flexDirection = 'column';
        groupWrapper.style.alignItems = 'center';
        
        // Create group element
        const group = document.createElement('div');
        group.className = 'group';
        group.dataset.index = i;
        
        // Set dynamic width (calculated from screen size + group count)
        group.style.width = `${columnWidth}px`;
        
        // Allow drop
        group.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        // Handle drop
        group.addEventListener('drop', (e) => {
            e.preventDefault();
            const itemId = parseInt(e.dataTransfer.getData('text/plain'));
            
            // Remove item from original position
            const itemElement = document.querySelector(`.item[data-id="${itemId}"]`);
            if (itemElement) {
                itemElement.remove();
                
                // Add to group
                const groupIndex = parseInt(group.dataset.index);
                sharingGroups[groupIndex].push(itemId);
                
                // Append item to group in DOM
                itemElement.draggable = false;
                group.appendChild(itemElement);
                
                // 🔥 Update counter immediately after drop
                updateGroupCounters();
            }
        });
        
        // 🔥 Create counter element for the group
        const counter = document.createElement('div');
        counter.className = 'group-counter';
        counter.textContent = `0`; // Initial count = 0
        
        // Add group + counter to wrapper
        groupWrapper.appendChild(group);
        groupWrapper.appendChild(counter);
        
        // Add wrapper to groups container
        groupsContainer.appendChild(groupWrapper);
    }
}

// Update sharing result
function updateSharingResult() {
    const totalItems = parseInt(document.getElementById('item-count-sharing').value);
    const totalGroups = parseInt(document.getElementById('group-count-sharing').value);
    
    const itemsPerGroup = Math.floor(totalItems / totalGroups);
    const remainder = totalItems % totalGroups;
    
    let currentDistribution = sharingGroups.map(group => group.length);
    let isComplete = currentDistribution.reduce((sum, count) => sum + count, 0) === totalItems-remainder;
    
    let resultText = '';
    if (isComplete) {
        resultText = `Perfect! Each group has ${itemsPerGroup} pencils, with ${remainder} left over.`;
    } else {
        resultText = `You need to distribute all ${totalItems} pencils into ${totalGroups} groups.`;
    }
    
    document.getElementById('sharing-result').textContent = resultText;
}

// --------------------------
// ENHANCED GROUPING SECTION
// --------------------------
let groupingItems = [];
let selectedItems = [];
let groupColors = [
    'var(--group-color-1)', 'var(--group-color-2)', 'var(--group-color-3)',
    'var(--group-color-4)', 'var(--group-color-5)', 'var(--group-color-6)',
    'var(--group-color-7)', 'var(--group-color-8)', 'var(--group-color-9)', 'var(--group-color-10)'
];

// Initialize grouping section (only runs on grouping.html)
function initGrouping() {
    if (!document.getElementById('grouping-items')) return; // Skip if not on grouping page
    
    const itemCount = parseInt(document.getElementById('item-count-grouping').value) || 20;
    const itemsPerGroup = parseInt(document.getElementById('items-per-group').value) || 3;
    
    // Reset arrays
    groupingItems = [];
    selectedItems = [];
    
    // Clear DOM elements
    const itemsContainer = document.getElementById('grouping-items');
    const visualGroupsContainer = document.getElementById('visual-groups');
    itemsContainer.innerHTML = '';
    visualGroupsContainer.innerHTML = '';
    document.getElementById('grouping-result').textContent = '';
    
    // Create selectable items (erasers)
    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement('div');
        item.className = 'grouping-item';
        item.textContent = '🍅';
        item.dataset.id = i;
        
        // Click event to select/deselect
        item.addEventListener('click', () => {
            const itemId = parseInt(item.dataset.id);
            const isSelected = selectedItems.includes(itemId);
            
            if (isSelected) {
                // Deselect
                selectedItems = selectedItems.filter(id => id !== itemId);
                item.classList.remove('selected');
            } else {
                // Select
                selectedItems.push(itemId);
                item.classList.add('selected');
            }
            
            // Update results and visual groups
            updateGroupingResult(itemsPerGroup);
            renderVisualGroups(itemsPerGroup);
        });
        
        itemsContainer.appendChild(item);
        groupingItems.push(i);
    }
}

// 重写 Render visual groups 函数，精准计算组的边界
function renderVisualGroups(itemsPerGroup) {
    const visualGroupsContainer = document.getElementById('visual-groups');
    visualGroupsContainer.innerHTML = ''; // Clear existing groups
    
    // Get selected items as DOM elements
    const selectedElements = selectedItems.map(id => 
        document.querySelector(`.grouping-item[data-id="${id}"]`)
    ).filter(el => el); // Remove nulls
    
    // Calculate complete groups
    const totalCompleteGroups = Math.floor(selectedElements.length / itemsPerGroup);
    
    // Create visual groups for each complete group
    for (let groupNum = 0; groupNum < totalCompleteGroups; groupNum++) {
        // Get items in this group
        const groupItems = selectedElements.slice(
            groupNum * itemsPerGroup, 
            (groupNum + 1) * itemsPerGroup
        );
        
        if (groupItems.length < itemsPerGroup) continue;
        
        // ------------ 核心修改：计算整个组的实际边界 ------------
        const containerRect = document.getElementById('grouping-container').getBoundingClientRect();
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        // 遍历组内所有橡皮，找到最外边界
        groupItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            // 计算相对于容器的坐标（包含额外边距，让边框不贴紧橡皮）
            const itemX = rect.left - containerRect.left - 8;  // 向左扩展8px
            const itemY = rect.top - containerRect.top - 8;    // 向上扩展8px
            const itemRight = rect.right - containerRect.left + 8; // 向右扩展8px
            const itemBottom = rect.bottom - containerRect.top + 8; // 向下扩展8px
            
            // 更新组的最小/最大边界
            minX = Math.min(minX, itemX);
            minY = Math.min(minY, itemY);
            maxX = Math.max(maxX, itemRight);
            maxY = Math.max(maxY, itemBottom);
        });
        
        // 计算矩形的宽高和位置
        const groupWidth = maxX - minX;
        const groupHeight = maxY - minY;
        
        // ------------ 创建圆角矩形视觉容器 ------------
        const visualGroup = document.createElement('div');
        visualGroup.className = 'visual-group';
        // 设置位置和尺寸（精准贴合组边界）
        visualGroup.style.left = `${minX}px`;
        visualGroup.style.top = `${minY}px`;
        visualGroup.style.width = `${groupWidth}px`;
        visualGroup.style.height = `${groupHeight}px`;
        // 颜色和文字
        visualGroup.style.borderColor = groupColors[groupNum % groupColors.length];
        visualGroup.textContent = `Group ${groupNum + 1}`;
        
        visualGroupsContainer.appendChild(visualGroup);
    }
}

// Update grouping result
function updateGroupingResult(itemsPerGroup) {
    const totalItems = parseInt(document.getElementById('item-count-grouping').value);
    const selectedCount = selectedItems.length;
    
    // Calculate groups formed
    const fullGroups = Math.floor(selectedCount / itemsPerGroup);
    const leftoverSelected = selectedCount % itemsPerGroup;
    const totalPossibleGroups = Math.floor(totalItems / itemsPerGroup);
    const totalRemainder = totalItems % itemsPerGroup;
    
    let resultText = '';
    // if (selectedCount === totalItems) {
    //     resultText = `Great! You made ${fullGroups} complete groups (${itemsPerGroup} erasers each), with ${totalRemainder} erasers left over. (Total: ${totalItems} ÷ ${itemsPerGroup} = ${totalPossibleGroups} remainder ${totalRemainder})`;
    // } else if (selectedCount === 0) {
    //     resultText = `Click on erasers to select them and make groups of ${itemsPerGroup}!`;
    // } else {
    //     resultText = `You've selected ${selectedCount} erasers. That makes ${fullGroups} complete groups (${itemsPerGroup} erasers each) with ${leftoverSelected} extra. Select all ${totalItems} erasers to see the full result!`;
    // }
    
    document.getElementById('grouping-result').textContent = resultText;
}

// --------------------------
// INITIALIZATION & EVENT LISTENERS
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sharing section (if on sharing page)
    if (document.getElementById('sharing-items')) {
        initSharing();
        document.getElementById('reset-sharing')?.addEventListener('click', initSharing);
        document.getElementById('item-count-sharing')?.addEventListener('change', initSharing);
        document.getElementById('group-count-sharing')?.addEventListener('change', initSharing);
    }
    
    // Initialize grouping section (if on grouping page)
    if (document.getElementById('grouping-items')) {
        initGrouping();
        document.getElementById('reset-grouping')?.addEventListener('click', initGrouping);
        document.getElementById('item-count-grouping')?.addEventListener('change', initGrouping);
        document.getElementById('items-per-group')?.addEventListener('change', initGrouping);
    }
});
