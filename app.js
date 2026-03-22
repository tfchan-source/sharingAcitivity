// --------------------------
// SHARE SECTION (DRAG & DROP)
// --------------------------
let sharingItems = [];
let sharingGroups = [];

// Initialize sharing section
function initSharing() {
    const itemCount = parseInt(document.getElementById('item-count-sharing').value);
    const groupCount = parseInt(document.getElementById('group-count-sharing').value);
    
    // Reset arrays
    sharingItems = [];
    sharingGroups = Array(groupCount).fill().map(() => []);
    
    // Clear DOM elements
    const itemsContainer = document.getElementById('sharing-items');
    const groupsContainer = document.getElementById('sharing-groups');
    itemsContainer.innerHTML = '';
    groupsContainer.innerHTML = '';
    document.getElementById('sharing-result').textContent = '';
    
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
        });
        
        itemsContainer.appendChild(item);
        sharingItems.push(i);
    }
    
    // Create empty groups/columns
    for (let i = 0; i < groupCount; i++) {
        const group = document.createElement('div');
        group.className = 'group';
        group.dataset.index = i;
        
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
                itemElement.draggable = false; // Prevent re-dragging
                group.appendChild(itemElement);
            }
        });
        
        groupsContainer.appendChild(group);
    }
}

// Update sharing result (calculate equal share + remainder)
function updateSharingResult() {
    const totalItems = parseInt(document.getElementById('item-count-sharing').value);
    const totalGroups = parseInt(document.getElementById('group-count-sharing').value);
    
    // Calculate division result
    const itemsPerGroup = Math.floor(totalItems / totalGroups);
    const remainder = totalItems % totalGroups;
    
    // Get current distribution
    let currentDistribution = sharingGroups.map(group => group.length);
    let isComplete = currentDistribution.reduce((sum, count) => sum + count, 0) === totalItems;
    
    let resultText = '';
    if (isComplete) {
        resultText = `Perfect! Each group has ${itemsPerGroup} pencils, with ${remainder} left over. (Total: ${totalItems} ÷ ${totalGroups} = ${itemsPerGroup} remainder ${remainder})`;
    } else {
        resultText = `Keep sharing! You need to distribute all ${totalItems} pencils into ${totalGroups} groups.`;
    }
    
    document.getElementById('sharing-result').textContent = resultText;
}

// --------------------------
// GROUPING SECTION (SELECTION)
// --------------------------
let groupingItems = [];
let selectedItems = [];

// Initialize grouping section
function initGrouping() {
    const itemCount = parseInt(document.getElementById('item-count-grouping').value);
    const itemsPerGroup = parseInt(document.getElementById('items-per-group').value);
    
    // Reset arrays
    groupingItems = [];
    selectedItems = [];
    
    // Clear DOM elements
    const itemsContainer = document.getElementById('grouping-items');
    itemsContainer.innerHTML = '';
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
                // Select (if not over max per group)
                selectedItems.push(itemId);
                item.classList.add('selected');
            }
            
            updateGroupingResult(itemsPerGroup);
        });
        
        itemsContainer.appendChild(item);
        groupingItems.push(i);
    }
}

// Update grouping result (calculate number of groups + remainder)
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
    } else {
        resultText = `You've selected ${selectedCount} erasers. That makes ${fullGroups} complete groups (${itemsPerGroup} erasers each) with ${leftoverSelected} extra. Select all ${totalItems} erasers to see the full result!`;
    }
    
    document.getElementById('grouping-result').textContent = resultText;
}

// --------------------------
// INITIALIZATION & EVENT LISTENERS
// --------------------------
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Sharing section
    initSharing();
    document.getElementById('reset-sharing').addEventListener('click', initSharing);
    document.getElementById('item-count-sharing').addEventListener('change', initSharing);
    document.getElementById('group-count-sharing').addEventListener('change', initSharing);
    
    // Grouping section
    initGrouping();
    document.getElementById('reset-grouping').addEventListener('click', initGrouping);
    document.getElementById('item-count-grouping').addEventListener('change', initGrouping);
    document.getElementById('items-per-group').addEventListener('change', initGrouping);
});
