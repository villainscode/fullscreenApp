import { windowControls } from './common/windowControls.js';

export const content = {
    template: `
        <main class="flex-1 flex flex-col overflow-hidden">
            <header class="content-header h-[70px] flex-shrink-0 flex items-center justify-between px-4">
                <div class="text-lg font-semibold">애플리케이션 제목</div>
                ${windowControls.template}
            </header>

            <div class="flex-1 flex flex-col no-drag overflow-hidden">
                <div class="editor-header h-[44px] flex-shrink-0 flex items-center px-4">
                    <span class="text-sm font-medium">에디터 영역</span>
                </div>
                
                <div class="main-content flex-1 content-area custom-scrollbar p-4" id="content-area">
                    <div class="space-y-6">
                        <h2 class="text-2xl font-bold">컨텐츠 영역</h2>
                        <p>이 영역은 수직 스크롤링이 가능합니다.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="content-card p-4 rounded-md">
                                <h3 class="font-semibold mb-2">항목 1</h3>
                                <p>샘플 컨텐츠입니다.</p>
                            </div>
                            <div class="content-card p-4 rounded-md">
                                <h3 class="font-semibold mb-2">항목 2</h3>
                                <p>샘플 컨텐츠입니다.</p>
                            </div>
                        </div>
                        
                        <div id="repeated-content"></div>
                    </div>
                </div>
            </div>

            <footer class="content-footer h-[60px] flex-shrink-0 no-drag flex items-center justify-between px-4">
                <div class="text-sm">상태 정보</div>
                <div class="text-sm">© 2025 Full Screen App</div>
            </footer>
        </main>
    `,

    init: () => {
        const repeatedContent = document.getElementById('repeated-content');
        if (!repeatedContent) return;

        const items = Array.from({ length: 10 }, (_, i) => `
            <div class="content-card-alt mb-4 p-4 rounded-md">
                <h3 class="font-semibold">섹션 ${i + 1}</h3>
                <p>스크롤 테스트를 위한 컨텐츠입니다.</p>
            </div>
        `);

        repeatedContent.innerHTML = items.join('');
    }
};