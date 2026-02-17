// Priority Color Coding Enhancement
// This script adds data-priority attributes to task cards for CSS styling

// Add this to the end of index.html after task rendering

// Function to add priority attributes to all task cards
function applyPriorityColors() {
  const taskCards = document.querySelectorAll('.task-card');
  taskCards.forEach(card => {
    // The priority is already in the task-priority span, extract it
    const prioritySpan = card.querySelector('.task-priority');
    if (prioritySpan) {
      const priority = prioritySpan.className.split(' ').find(c => ['low', 'medium', 'high'].includes(c));
      if (priority) {
        card.setAttribute('data-priority', priority);
      }
    }
  });
}

// Call after each task load
// Add this to initPage(), loadTasks(), loadTimetable(), loadUpcomingTasks()
