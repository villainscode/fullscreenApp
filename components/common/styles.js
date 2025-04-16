export const styles = {
    init: () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                -webkit-app-region: drag;
            }
            
            .no-drag {
                -webkit-app-region: no-drag;
            }
            
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #a0a0a0;
            }
            
            .content-area {
                height: 0;
                min-height: 0;
                overflow-y: auto;
            }

            .resizer {
                width: 5px;
                height: 100%;
                background-color: #e5e7eb;
                cursor: col-resize;
                transition: background-color 0.2s;
            }

            .resizer:hover, .resizing .resizer {
                background-color: #3b82f6;
            }

            .resizing {
                cursor: col-resize;
                user-select: none;
            }
            
            @media (max-width: 768px) {
                .responsive-layout {
                    flex-direction: column;
                }
                
                .sidebar {
                    width: 100% !important;
                    height: auto !important;
                    max-height: 200px;
                }

                .resizer {
                    display: none;
                }
            }

            .sidebar {
                transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
            }

            .sidebar-hidden {
                width: 0 !important;
                padding: 0;
                overflow: hidden;
                opacity: 0;
            }

            .sidebar-container {
                transition: width 0.3s ease-in-out;
            }

            .sidebar-visible {
                width: auto;
            }

            #show-sidebar-btn {
                transition: opacity 0.3s ease-in-out;
            }

            #sidebar-container.w-10 .sidebar {
                display: none;
            }

            #sidebar-container.w-10 #show-sidebar-btn {
                display: flex;
            }
        `;
        document.head.appendChild(styleElement);
    }
};