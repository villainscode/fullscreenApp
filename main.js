const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

/**
 * 메인 윈도우 관리를 담당하는 클래스
 * 윈도우 생성, 표시, 컨트롤 이벤트 처리 등을 관리
 */
class WindowManager {
    constructor() {
        this.mainWindow = null;
    }

    /**
     * 메인 윈도우를 생성하고 초기 설정을 수행
     * @returns {void}
     */
    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            },
            frame: false,
            backgroundColor: '#FFF'
        });

        this.mainWindow.loadFile('index.html');
        
        if (process.env.NODE_ENV === 'development') {
            this.mainWindow.webContents.openDevTools();
        }

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
            TrayManager.destroy();
        });
    }

    /**
     * 윈도우가 존재하면 보여주고, 없으면 새로 생성
     * @returns {void}
     */
    showWindow() {
        if (!this.mainWindow) {
            this.createWindow();
        } else {
            this.mainWindow.show();
        }
    }

    /**
     * 윈도우 컨트롤(최소화, 최대화, 닫기) 이벤트 핸들러 설정
     * @returns {void}
     */
    handleWindowControls() {
        ipcMain.on('minimize-window', () => {
            this.mainWindow?.minimize();
        });

        ipcMain.on('maximize-window', () => {
            if (this.mainWindow?.isMaximized()) {
                this.mainWindow.unmaximize();
            } else {
                this.mainWindow?.maximize();
            }
        });

        ipcMain.on('close-window', () => {
            app.quit();
        });
    }
}

/**
 * 시스템 트레이 아이콘 관리를 담당하는 클래스
 * 트레이 아이콘 생성, 컨텍스트 메뉴 설정, 이벤트 처리 등을 관리
 */
class TrayManager {
    static tray = null;

    /**
     * 트레이 아이콘 이미지 생성
     * macOS의 경우 16x16 크기로 리사이징
     * @returns {Electron.NativeImage} 트레이에 사용될 아이콘 이미지
     */
    static createTrayIcon() {
        const iconPath = path.resolve(__dirname, '/assets/icon.png');
        const trayIcon = nativeImage.createFromPath(iconPath);
        
        return process.platform === 'darwin'
            ? trayIcon.resize({ width: 16, height: 16 })
            : trayIcon;
    }

    /**
     * 트레이 아이콘 생성 및 초기 설정
     * @param {WindowManager} windowManager - 윈도우 관리자 인스턴스
     * @returns {void}
     */
    static create(windowManager) {
        try {
            this.destroy();

            const trayIcon = this.createTrayIcon();
            this.tray = new Tray(trayIcon);
            
            if (process.platform === 'darwin') {
                this.tray.setIgnoreDoubleClickEvents(true);
            }

            const contextMenu = Menu.buildFromTemplate([
                {
                    label: '열기',
                    click: () => windowManager.showWindow()
                },
                {
                    label: '종료',
                    click: () => {
                        this.destroy();
                        app.quit();
                    }
                }
            ]);
            
            this.tray.setToolTip('Full Screen App');
            this.tray.setContextMenu(contextMenu);
            this.tray.on('click', () => windowManager.showWindow());

            console.log('트레이 아이콘이 생성되었습니다.');
        } catch (error) {
            console.error('트레이 아이콘 생성 오류:', error);
        }
    }

    /**
     * 트레이 아이콘 제거
     * @returns {void}
     */
    static destroy() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
}

/**
 * 전체 애플리케이션 생명주기를 관리하는 클래스
 * 앱 초기화, 이벤트 설정 등을 담당
 */
class Application {
    /**
     * Application 클래스 생성자
     * WindowManager 인스턴스를 초기화
     */
    constructor() {
        this.windowManager = new WindowManager();
    }

    /**
     * 애플리케이션 초기화
     * - 앱 준비 완료 시 윈도우 생성
     * - 윈도우 컨트롤 이벤트 핸들러 설정
     * - 트레이 아이콘 생성
     * - 앱 활성화/종료 이벤트 처리
     * @returns {void}
     */
    init() {
        app.whenReady().then(() => {
            this.windowManager.createWindow();
            this.windowManager.handleWindowControls();
            TrayManager.create(this.windowManager);

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.windowManager.createWindow();
                }
            });
        });

        app.on('window-all-closed', () => {
            app.quit();
        });
    }
}

// 애플리케이션 시작
new Application().init(); 