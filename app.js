
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
        item.textContent = '✏️';
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
        item.textContent = '🧼';
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

// Render visual groups (colored circles around complete groups)
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
        // Get items in this group (e.g., group 0 = items 0-2, group 1 = 3-5 for 3 items/group)
        const groupItems = selectedElements.slice(
            groupNum * itemsPerGroup, 
            (groupNum + 1) * itemsPerGroup
        );
        
        if (groupItems.length < itemsPerGroup) continue;
        
        // Calculate center position of the group
        let totalX = 0, totalY = 0;
        let maxWidth = 0, maxHeight = 0;
        
        groupItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const containerRect = document.getElementById('grouping-container').getBoundingClientRect();
            
            // Position relative to container
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;
            
            totalX += x;
            totalY += y;
            
            maxWidth = Math.max(maxWidth, rect.width);
            maxHeight = Math.max(maxHeight, rect.height);
        });
        
        // Center of the group
        const centerX = totalX / groupItems.length;
        const centerY = totalY / groupItems.length;
        
        // Size of the circle (big enough to cover all items in the group)
        const groupSize = Math.max(maxWidth, maxHeight) * 1.8 + (itemsPerGroup > 3 ? 20 : 10);
        
        // Create visual group circle
        const visualGroup = document.createElement('div');
        visualGroup.className = 'visual-group';
        visualGroup.style.width = `${groupSize}px`;
        visualGroup.style.height = `${groupSize}px`;
        visualGroup.style.left = `${centerX - groupSize/2}px`;
        visualGroup.style.top = `${centerY - groupSize/2}px`;
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
    if (selectedCount === totalItems) {
        resultText = `Great! You made ${fullGroups} complete groups (${itemsPerGroup} erasers each), with ${totalRemainder} erasers left over. (Total: ${totalItems} ÷ ${itemsPerGroup} = ${totalPossibleGroups} remainder ${totalRemainder})`;
    } else if (selectedCount === 0) {
        resultText = `Click on erasers to select them and make groups of ${itemsPerGroup}!`;
    } else {
        resultText = `You've selected ${selectedCount} erasers. That makes ${fullGroups} complete groups (${itemsPerGroup} erasers each) with ${leftoverSelected} extra. Select all ${totalItems} erasers to see the full result!`;
    }
    
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
