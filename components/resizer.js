export const resizer = {
    template: `<div class="resizer no-drag" id="resizer"></div>`,

    init: () => {
        const resizer = document.getElementById('resizer');
        const sidebar = document.getElementById('sidebar');
        const appContainer = document.getElementById('app-container');
        
        if (!resizer || !sidebar || !appContainer) return;

        let isResizing = false;

        const handleMouseDown = (e) => {
            isResizing = true;
            document.body.classList.add('resizing');
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isResizing) return;
            
            const newWidth = Math.min(
                Math.max(
                    e.clientX - appContainer.offsetLeft,
                    150  // 최소 너비
                ),
                appContainer.offsetWidth - 300  // 최대 너비
            );
            
            sidebar.style.width = `${newWidth}px`;
            localStorage.setItem('sidebarWidth', newWidth);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                document.body.classList.remove('resizing');
            }
        };

        resizer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
};