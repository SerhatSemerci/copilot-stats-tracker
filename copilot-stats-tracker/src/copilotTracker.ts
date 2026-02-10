import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface CopilotStats {
    userName: string;
    date: string;
    time: string;
    linesAdded: number;
    linesDeleted: number;
    linesModified: number;
    fileName: string;
    language: string;
}

interface DailyStats {
    date: string;
    userName: string;
    totalLinesAdded: number;
    totalLinesDeleted: number;
    totalLinesModified: number;
    acceptanceCount: number;
}

export class CopilotTracker {
    private context: vscode.ExtensionContext;
    private logFilePath: string;
    private dailyStatsFilePath: string;
    private disposables: vscode.Disposable[] = [];
    private documentStates: Map<string, string[]> = new Map();
    private pendingChanges: Map<string, NodeJS.Timeout> = new Map();

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.logFilePath = this.getLogFilePath();
        this.dailyStatsFilePath = this.getDailyStatsFilePath();
        this.initializeLogFiles();
        this.startTracking();
    }

    private getLogFilePath(): string {
        const config = vscode.workspace.getConfiguration('copilotStatsTracker');
        const customPath = config.get<string>('logFilePath');
        
        if (customPath) {
            return path.join(customPath, 'copilot-stats.txt');
        }

        // Workspace varsa orada, yoksa home directory'de
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            return path.join(workspaceFolder.uri.fsPath, 'copilot-stats.txt');
        }

        return path.join(os.homedir(), 'copilot-stats.txt');
    }

    private getDailyStatsFilePath(): string {
        const logDir = path.dirname(this.logFilePath);
        return path.join(logDir, 'copilot-daily-stats.json');
    }

    private initializeLogFiles(): void {
        const logDir = path.dirname(this.logFilePath);
        
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        if (!fs.existsSync(this.logFilePath)) {
            const header = '=== Copilot Stats Tracker Log ===\n' +
                          'Format: [Tarih] [Saat] | Kullanıcı | Dosya | +Eklenen -Silinen ~Değiştirilen\n' +
                          '=' .repeat(80) + '\n\n';
            fs.writeFileSync(this.logFilePath, header, 'utf8');
        }

        if (!fs.existsSync(this.dailyStatsFilePath)) {
            fs.writeFileSync(this.dailyStatsFilePath, JSON.stringify([], null, 2), 'utf8');
        }
    }

    private startTracking(): void {
        // Text document değişikliklerini takip et
        const changeDisposable = vscode.workspace.onDidChangeTextDocument(
            this.onDocumentChange,
            this
        );
        this.disposables.push(changeDisposable);

        // Yeni döküman açıldığında başlangıç durumunu kaydet
        const openDisposable = vscode.workspace.onDidOpenTextDocument(
            this.onDocumentOpen,
            this
        );
        this.disposables.push(openDisposable);

        // Mevcut açık dökümanları kaydet
        vscode.workspace.textDocuments.forEach(doc => {
            this.saveDocumentState(doc);
        });
    }

    private onDocumentOpen(document: vscode.TextDocument): void {
        this.saveDocumentState(document);
    }

    private saveDocumentState(document: vscode.TextDocument): void {
        if (document.uri.scheme === 'file') {
            const lines = [];
            for (let i = 0; i < document.lineCount; i++) {
                lines.push(document.lineAt(i).text);
            }
            this.documentStates.set(document.uri.toString(), lines);
        }
    }

    private onDocumentChange(event: vscode.TextDocumentChangeEvent): void {
        const document = event.document;
        
        // Sadece gerçek dosyaları takip et
        if (document.uri.scheme !== 'file') {
            return;
        }

        // Git, output, debug console gibi özel dökümanları atla
        if (document.uri.scheme === 'output' || 
            document.uri.scheme === 'debug' ||
            document.fileName.includes('.git')) {
            return;
        }

        // Eğer değişiklik varsa
        if (event.contentChanges.length > 0) {
            // Debounce: Hızlı değişiklikleri grupla
            const uri = document.uri.toString();
            
            if (this.pendingChanges.has(uri)) {
                clearTimeout(this.pendingChanges.get(uri)!);
            }

            const timeout = setTimeout(() => {
                this.processDocumentChanges(document, event);
                this.pendingChanges.delete(uri);
            }, 500); // Yarım saniye bekle

            this.pendingChanges.set(uri, timeout);
        }
    }

    private processDocumentChanges(
        document: vscode.TextDocument,
        event: vscode.TextDocumentChangeEvent
    ): void {
        let totalLinesAdded = 0;
        let totalLinesDeleted = 0;
        let totalLinesModified = 0;

        for (const change of event.contentChanges) {
            const addedText = change.text;
            const deletedRange = change.range;
            
            // Silinen satır sayısı
            const deletedLines = deletedRange.end.line - deletedRange.start.line;
            
            // Eklenen satır sayısı
            const addedLines = (addedText.match(/\n/g) || []).length;

            // Eğer aynı satırda değişiklik yapıldıysa (modification)
            if (deletedRange.start.line === deletedRange.end.line && addedLines === 0) {
                // Aynı satırda karakter değişimi
                if (addedText.length > 0 && !deletedRange.isEmpty) {
                    totalLinesModified++;
                } else if (addedText.length > 0) {
                    // Sadece ekleme var, yeni satır yok
                    if (addedText.includes('\n')) {
                        totalLinesAdded += addedLines;
                    } else {
                        totalLinesModified++;
                    }
                } else if (!deletedRange.isEmpty) {
                    // Sadece silme
                    totalLinesDeleted += deletedLines > 0 ? deletedLines : 1;
                }
            } else {
                // Çok satırlı değişiklik
                if (addedLines > 0) {
                    totalLinesAdded += addedLines;
                }
                if (deletedLines > 0) {
                    totalLinesDeleted += deletedLines;
                }
                
                // İlk ve son satır modified olabilir
                if (deletedLines === 0 && addedLines === 0 && !deletedRange.isEmpty) {
                    totalLinesModified++;
                }
            }
        }

        // En az bir değişiklik varsa logla
        if (totalLinesAdded > 0 || totalLinesDeleted > 0 || totalLinesModified > 0) {
            this.logStats({
                userName: this.getUserName(),
                date: this.getDate(),
                time: this.getTime(),
                linesAdded: totalLinesAdded,
                linesDeleted: totalLinesDeleted,
                linesModified: totalLinesModified,
                fileName: path.basename(document.fileName),
                language: document.languageId
            });
        }

        // Yeni durumu kaydet
        this.saveDocumentState(document);
    }

    private getUserName(): string {
        const config = vscode.workspace.getConfiguration('copilotStatsTracker');
        const userName = config.get<string>('userName');
        
        if (userName) {
            return userName;
        }

        return os.userInfo().username || 'unknown';
    }

    private getDate(): string {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    private getTime(): string {
        const now = new Date();
        return now.toTimeString().split(' ')[0]; // HH:MM:SS
    }

    private logStats(stats: CopilotStats): void {
        // TXT dosyasına yaz
        const logLine = `[${stats.date}] [${stats.time}] | ${stats.userName} | ${stats.fileName} | ` +
                       `+${stats.linesAdded} -${stats.linesDeleted} ~${stats.linesModified} | ${stats.language}\n`;
        
        try {
            fs.appendFileSync(this.logFilePath, logLine, 'utf8');
            
            // Günlük istatistikleri güncelle
            this.updateDailyStats(stats);
        } catch (error) {
            console.error('Log yazma hatası:', error);
        }
    }

    private updateDailyStats(stats: CopilotStats): void {
        try {
            let dailyStats: DailyStats[] = [];
            
            if (fs.existsSync(this.dailyStatsFilePath)) {
                const content = fs.readFileSync(this.dailyStatsFilePath, 'utf8');
                dailyStats = JSON.parse(content);
            }

            // Bugünkü kullanıcı istatistiğini bul
            const todayKey = `${stats.date}_${stats.userName}`;
            let todayStats = dailyStats.find(
                s => s.date === stats.date && s.userName === stats.userName
            );

            if (!todayStats) {
                todayStats = {
                    date: stats.date,
                    userName: stats.userName,
                    totalLinesAdded: 0,
                    totalLinesDeleted: 0,
                    totalLinesModified: 0,
                    acceptanceCount: 0
                };
                dailyStats.push(todayStats);
            }

            todayStats.totalLinesAdded += stats.linesAdded;
            todayStats.totalLinesDeleted += stats.linesDeleted;
            todayStats.totalLinesModified += stats.linesModified;
            todayStats.acceptanceCount++;

            fs.writeFileSync(
                this.dailyStatsFilePath,
                JSON.stringify(dailyStats, null, 2),
                'utf8'
            );
        } catch (error) {
            console.error('Günlük istatistik güncelleme hatası:', error);
        }
    }

    public showStats(): void {
        try {
            if (!fs.existsSync(this.dailyStatsFilePath)) {
                vscode.window.showInformationMessage('Henüz istatistik verisi yok.');
                return;
            }

            const content = fs.readFileSync(this.dailyStatsFilePath, 'utf8');
            const dailyStats: DailyStats[] = JSON.parse(content);

            if (dailyStats.length === 0) {
                vscode.window.showInformationMessage('Henüz istatistik verisi yok.');
                return;
            }

            // Son 7 günü göster
            const recentStats = dailyStats.slice(-7);
            let message = '📊 Copilot İstatistikleri (Son 7 Gün):\n\n';

            recentStats.forEach(stat => {
                message += `📅 ${stat.date} - ${stat.userName}\n`;
                message += `   ✅ Eklenen: ${stat.totalLinesAdded} satır\n`;
                message += `   ❌ Silinen: ${stat.totalLinesDeleted} satır\n`;
                message += `   🔄 Değiştirilen: ${stat.totalLinesModified} satır\n`;
                message += `   📝 İşlem sayısı: ${stat.acceptanceCount}\n\n`;
            });

            vscode.window.showInformationMessage(message, { modal: true });
        } catch (error) {
            vscode.window.showErrorMessage('İstatistikler yüklenemedi: ' + error);
        }
    }

    public resetStats(): void {
        const options = ['Evet, Sıfırla', 'İptal'];
        vscode.window.showWarningMessage(
            'Tüm istatistikleri silmek istediğinize emin misiniz?',
            ...options
        ).then(selection => {
            if (selection === options[0]) {
                try {
                    fs.writeFileSync(this.dailyStatsFilePath, JSON.stringify([], null, 2), 'utf8');
                    
                    const header = '=== Copilot Stats Tracker Log ===\n' +
                                  'Format: [Tarih] [Saat] | Kullanıcı | Dosya | +Eklenen -Silinen ~Değiştirilen\n' +
                                  '='.repeat(80) + '\n\n';
                    fs.writeFileSync(this.logFilePath, header, 'utf8');
                    
                    vscode.window.showInformationMessage('İstatistikler sıfırlandı.');
                } catch (error) {
                    vscode.window.showErrorMessage('Sıfırlama hatası: ' + error);
                }
            }
        });
    }

    public openLogFile(): void {
        if (fs.existsSync(this.logFilePath)) {
            const uri = vscode.Uri.file(this.logFilePath);
            vscode.window.showTextDocument(uri);
        } else {
            vscode.window.showErrorMessage('Log dosyası bulunamadı: ' + this.logFilePath);
        }
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        
        // Bekleyen timeout'ları temizle
        this.pendingChanges.forEach(timeout => clearTimeout(timeout));
        this.pendingChanges.clear();
    }
}
